/** @jsxImportSource @emotion/react */
import React from "react";
import {css} from "@emotion/react";
import {NavBar} from "./NavBar/NavBar";
import {LetterDisplay} from "./LetterDisplay/LetterDisplay";
import './Main.css';
import {Keyboard} from "./Keyboard/Keyboard";
import {
    clearGuesses,
    KeyState,
    LetterState,
    LetterStates,
    loadGuesses,
    loadSettings,
    loadStats,
    MAX_ATTEMPTS,
    PlayerStats,
    saveGuesses,
    saveSettings,
    saveStats
} from "./Models";
import {Popup} from "./Popup/Popup";
import {HelpModal} from "./Modal/HelpModal";
import {StatsModal} from "./Modal/StatsModal";
import {SettingsModal} from "./Modal/SettingsModal";
import {ColourTheme, DarkTheme, defaultTheme, GameTheme, highContrast, LightTheme} from "./Style";

function objectArray<Type>(numElements: number, elementFactory: () => Type): Array<Type> {
    return new Array(numElements).fill(null).map(elementFactory);
}

function gameContainerStyle(theme: GameTheme) {
    return css`
        width: 100%;
        height: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
        background-color: ${theme.background};
        color: ${theme.text}
    `;
}

export interface Settings {
    hardMode: boolean;
    darkMode: boolean;
    highContrastMode: boolean;
    dailyNerdle: boolean;
    wordleWordlist: boolean;
}

interface MainState extends Settings {
    guesses: Array<Array<LetterState>>;
    keyboard: Map<string, KeyState>;
    popupList: Array<string>;
    statsModal: boolean;
    helpModal: boolean;
    settingsModal: boolean;
    hardMode: boolean;
    darkMode: boolean;
    highContrastMode: boolean;
    finished: boolean;
    theme: GameTheme;
}

export class Main extends React.Component<{}, MainState> {
    LOWERCASE_ALPHABET: string = "abcdefghijklmnopqrstuvwxyz";
    KEYBOARD_LAYOUT: Array<Array<string>> = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M"]
    ];
    SUCCESS_MESSAGE: Array<string> = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];
    MILLISECONDS_IN_DAY: number = (24 * 3600 * 1000);

    wordList: Array<string>;
    wordListIndex: number;
    attempt: number;
    lettersEntered: number;
    word: string;

    playerStats: PlayerStats;

    constructor(props: Readonly<{}>) {
        super(props);
        this.attempt = 0;
        this.lettersEntered = 0;
        this.word = "";
        this.wordList = [];
        this.wordListIndex = 0;

        this.playerStats = loadStats();
        const settings = loadSettings();
        let {guesses, keyboard, popupList} = this.reset();

        this.loadWordlist(settings.wordleWordlist).then(() => {

            let finished = false;
            if (settings.dailyNerdle) {
                const dailyNerdleData = this.loadDailyNerdle();
                finished = dailyNerdleData[1]
                if (dailyNerdleData[0].length > 0) {
                    guesses = dailyNerdleData[0]
                }
            }

            this.setState({guesses: guesses, finished: finished})
        })

        let theme = new LightTheme(settings.highContrastMode);
        if (settings.darkMode) {
            theme = new DarkTheme(settings.highContrastMode);
        }

        this.state = {
            ...settings,
            guesses: guesses,
            keyboard: keyboard,
            popupList: popupList,
            helpModal: false,
            settingsModal: false,
            statsModal: false,
            finished: false,
            theme: theme,
        };

    }

    loadWordlist = (wordle_wordlist: boolean): Promise<void> => {
        const wordlist = (wordle_wordlist) ? "/5letter_upper_wordle.txt" : "/5letter_upper.txt";

        return fetch(document.location.pathname + wordlist)
            .then(response => response.text())
            .then(content => {
                this.wordList = content.split("\n");
                this.pickWord(this.state.dailyNerdle);
            });
    }

    loadDailyNerdle = (): [Array<Array<LetterState>>, boolean] => {
        const guesses = objectArray(MAX_ATTEMPTS, () => objectArray(5, () => new LetterState("")));
        let finished = false;
        const guessData = loadGuesses();

        // calcWordListIndex should return the next index if we have advanced a day since the last save.
        if (guessData && guessData[1] == this.calcWordListIndex(true)) {
            const storedGuesses = guessData[0];

            storedGuesses.forEach((guess, i) => guess.forEach((state, j) => {
                guesses[i][j] = new LetterState(state.name, state.state);
            }));

            // Count how many guesses have been populated.
            this.attempt = storedGuesses.reduce(
                (total, guess) => total + ((guess[0].state != LetterStates.BASE) ? 1 : 0),
                0)

            // Check if there was a correct guess
            const alreadyWon = storedGuesses.some(guess => guess.every(letter => letter.state == LetterStates.CORRECT))
            finished = alreadyWon || this.attempt == 5
            return [guesses, finished]

        } else {
            clearGuesses();
        }

        return [[], false];
    }

    reset = (setState: boolean = false, pickWord: boolean = true): Pick<MainState, "guesses" | "keyboard" | "popupList"> => {
        const guesses: Array<Array<LetterState>> = objectArray(MAX_ATTEMPTS,
            () => objectArray(5, () => new LetterState("")));

        const keyboard = new Map(
            this.KEYBOARD_LAYOUT.flat().map(key => [key, new KeyState(key, this.guessFactory(key))]));

        const state = {
            guesses: guesses,
            keyboard: keyboard,
            popupList: [],
            finished: false
        };

        if (setState) {
            this.setState(state);
        }

        if (this.wordList.length > 0 && pickWord) {
            this.pickWord(this.state.dailyNerdle);
        }

        this.lettersEntered = 0;
        this.attempt = 0;

        return state;
    }

    calcWordListIndex = (dailyNerdle: boolean) => {
        if (dailyNerdle) {
            const daysSinceEpoch = new Date().valueOf() / this.MILLISECONDS_IN_DAY;
            const daysUntilStart = new Date(2021, 4, 18).valueOf() / this.MILLISECONDS_IN_DAY;
            // Offset enough to be different from wordle when using the wordle wordlist.
            return Math.floor(daysSinceEpoch - daysUntilStart + 1000) % this.wordList.length;
        } else {
            return Math.floor(Math.random() * this.wordList.length);
        }
    }

    pickWord = (dailyNerdle: boolean) => {
        this.wordListIndex = this.calcWordListIndex(dailyNerdle);
        this.word = this.wordList[this.wordListIndex];
        // pseudo debug mode check
        if (document.location.hostname == "localhost") {
            this.addPopup(this.word);
        }
    }

    positionToString = (position: number): string => {
        if (position == 1) {
            return "1st"
        } else if (position == 2) {
            return "2nd"
        } else if (position == 3) {
            return "3rd"
        } else {
            return String(position) + "th"
        }
    }

    validHardModeSubmission = (guessedWord: string): boolean => {
        console.log(this.state.guesses.slice(0, this.attempt))

        for (const guess of this.state.guesses.slice(0, this.attempt)) {
            let correctMessage = "";
            let closeMessage = "";

            for (const [index, letterState] of guess.entries()) {
                if (letterState.state == LetterStates.CORRECT && guessedWord[index] != letterState.name) {
                    correctMessage = `${this.positionToString(index + 1)} letter must be ${letterState.name}`;
                    break;
                }

                if (letterState.state == LetterStates.CLOSE && guessedWord.indexOf(letterState.name) < 0) {
                    closeMessage = `Guess must contain ${letterState.name}`;
                    // Not breaking because we might find a previous correct letter guess.
                    // Correct letters have higher precedence.
                }
            }

            if (correctMessage.length == 0 && closeMessage.length == 0) {
                continue;
            }

            this.addPopup((correctMessage.length > 0) ? correctMessage : closeMessage);
            return false;
        }

        return true;
    }

    submit = () => {
        if (this.state.finished) {
            return;
        }

        const guessedWord = this.state.guesses[this.attempt]
            .map(letterState => letterState.name)
            .join("");

        if (this.state.guesses[this.attempt].every(guess => guess.state != LetterStates.BASE)
            || this.attempt >= MAX_ATTEMPTS) {
            // We've already completed
            return;
        } else if (!this.wordList.includes(guessedWord)) {
            this.addPopup("Not in word list")
        } else if (this.lettersEntered < 5) {
            this.addPopup("Not enough letters");
        } else if (this.state.hardMode && !this.validHardModeSubmission(guessedWord)) {
            // validHardModeSubmission will add a popup if it's invalid, so just return.
            return;
        } else {
            // Valid Guess
            const keyboardState = this.state.keyboard;
            const guesses = this.state.guesses;
            const guessedLetters = guessedWord.split("")

            const currentGuess = guesses[this.attempt];

            // workout correct and incorrect letters
            currentGuess.forEach((letterState, index) => {
                const letter = letterState.name;

                if (letter == this.word[index]) {
                    letterState.state = LetterStates.CORRECT;
                } else if (!this.word.includes(letter)) {
                    letterState.state = LetterStates.INCORRECT;
                } else {
                    return;
                }

                const keyState = keyboardState.get(letter);
                if (keyState && keyState.state != LetterStates.CORRECT) {
                    keyState.state = letterState.state;
                }
            });

            // workout close letters
            currentGuess.forEach((letterState, index) => {
                if (letterState.state != LetterStates.BASE) {
                    return;
                }

                const letter = letterState.name;

                // find how many times this letter appears in the guess so far
                const guessLetterInstances = guessedLetters
                    .slice(0, index)
                    .reduce((total, next) => (next == letter) ? total + 1 : total, 0);

                const correctGuessLetterInstances = guessedLetters
                    .reduce((total, next, index) =>
                        (next == letter && currentGuess[index].state == LetterStates.CORRECT) ? total + 1 : total, 0);

                const wordLetterInstances = this.word.split("")
                    .reduce((total, next) => (next == letter) ? total + 1 : total, 0)

                if (correctGuessLetterInstances == wordLetterInstances || guessLetterInstances >= wordLetterInstances) {
                    letterState.state = LetterStates.INCORRECT;
                } else if (guessLetterInstances < wordLetterInstances) {
                    letterState.state = LetterStates.CLOSE;
                }

                const keyState = keyboardState.get(letter);
                if (keyState && keyState.state != LetterStates.CORRECT) {
                    keyState.state = letterState.state;
                }
            });

            if (this.state.dailyNerdle) {
                saveGuesses(this.state.guesses, this.wordListIndex)
            }

            if (this.word != guessedWord && this.attempt + 1 < MAX_ATTEMPTS) {
                // Guesses remaining.
                this.setState({keyboard: keyboardState, guesses: guesses})
                this.lettersEntered = 0;
                this.attempt++;
                return;
            }

            // Game over, they won or lost.
            const won = (guessedWord == this.word);
            const popupMessage = (won) ? this.SUCCESS_MESSAGE[this.attempt] : this.word;

            this.addPopup(popupMessage);
            this.playerStats.addGame(this.attempt + 1, won);
            setTimeout(() => this.setState({statsModal: true, finished: true}), 2000);
            saveStats(this.playerStats);
        }
    }

    backspace = () => {
        if (this.state.finished) {
            return;
        }

        if (this.lettersEntered > 0) {
            const guessState = this.state.guesses;
            guessState[this.attempt][this.lettersEntered - 1].name = '';
            this.setState({
                guesses: guessState
            });
            this.lettersEntered -= 1;
        }
    }

    guessFactory(letter: string) {
        return this.guess.bind(this, letter);
    }

    guess = (letter: string) => {
        if (this.state.finished) {
            return;
        }
        if (this.lettersEntered < 5 && this.attempt < MAX_ATTEMPTS) {
            const guessState = this.state.guesses;
            guessState[this.attempt][this.lettersEntered].name = letter;
            this.setState({
                guesses: guessState
            });
            this.lettersEntered++;
        }
    }

    handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();

        if (key == "enter") {
            this.submit();
        } else if (key == "backspace") {
            this.backspace();
        } else if (this.LOWERCASE_ALPHABET.includes(key)) {
            this.guess(key.toUpperCase());
        }
    }

    componentDidMount() {
        document.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    addPopup = (message: string) => {
        const popupList = this.state.popupList;
        popupList.push(message);
        this.setState({popupList: popupList})
    }

    removePopup = (index: number) => {
        const popupList = this.state.popupList;
        // If the index is too big, remove the last popup.
        const toRemove = Math.min(popupList.length - 1, index);
        popupList.splice(toRemove, 1);
        this.setState({popupList: popupList})
    }

    updateSettings = (state: keyof Settings, value: boolean) => {
        const settings: Settings = {
            hardMode: this.state.hardMode,
            darkMode: this.state.darkMode,
            highContrastMode: this.state.highContrastMode,
            dailyNerdle: this.state.dailyNerdle,
            wordleWordlist: this.state.wordleWordlist
        };
        settings[state] = value;
        saveSettings(settings)
    }

    switchChangeFactory = (key: keyof Settings) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({[key]: event.target.checked} as unknown as Pick<MainState, keyof MainState>)
            this.updateSettings(key, event.target.checked)
        }
    }

    highContrastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        let newTheme = new LightTheme(checked);
        if (this.state.darkMode) {
            newTheme = new DarkTheme(checked);
        }
        this.setState({highContrastMode: checked, theme: newTheme});
        this.updateSettings("highContrastMode", checked)
    }

    setDailyNerdle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = event.target.checked;

        let finished = this.state.finished;
        let guesses = this.state.guesses;
        if (enabled) {
            const dailyNerdleData = this.loadDailyNerdle();
            if (dailyNerdleData[0].length > 0) {
                finished = dailyNerdleData[1];
                guesses = dailyNerdleData[0];
            }
            this.setState({dailyNerdle: enabled, finished: finished, guesses: guesses});
        } else {
            this.reset(true, false);
            this.setState({dailyNerdle: enabled});
        }
        this.pickWord(enabled);
        this.updateSettings("dailyNerdle", enabled);
    }

    setWordList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        this.loadWordlist(checked);
        this.reset(true, false);
        this.setState({wordleWordlist: checked});
        this.updateSettings("wordleWordlist", checked);
    }

    setDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        let newTheme = new LightTheme(this.state.theme.isHighContrast);
        if (checked) {
            newTheme = new DarkTheme(this.state.theme.isHighContrast);
        }
        this.setState({darkMode: checked, theme: newTheme});
        this.updateSettings("darkMode", checked);
    }

    render() {
        return (
            <div css={gameContainerStyle(this.state.theme)}>
                <NavBar
                    newGame={() => this.reset(true)}
                    help={() => this.setState({helpModal: true})}
                    stats={() => this.setState({statsModal: true})}
                    settings={() => this.setState({settingsModal: true})}
                    showNewGame={!this.state.dailyNerdle}
                    theme={this.state.theme}
                />
                <LetterDisplay cells={this.state.guesses} theme={this.state.theme}/>
                <Keyboard
                    keystate={this.state.keyboard}
                    keyboardLayout={this.KEYBOARD_LAYOUT}
                    enterClicked={this.submit}
                    backspaceClicked={this.backspace}
                    theme={this.state.theme}
                />
                <div className="popup-container">
                    {this.state.popupList.map((message, index) =>
                        <Popup removeMe={this.removePopup}
                               duration_ms={3000} index={index} key={index}>
                            {message}
                        </Popup>)}
                </div>
                <HelpModal
                    title="HOW TO PLAY"
                    show={this.state.helpModal}
                    closeModal={() => this.setState({helpModal: false})}
                    theme={this.state.theme}
                />
                <StatsModal
                    title="STATISTICS"
                    show={this.state.statsModal}
                    closeModal={() => this.setState({statsModal: false})}
                    stats={this.playerStats}
                    showTime={this.state.finished && this.state.dailyNerdle}
                    theme={this.state.theme}
                />
                <SettingsModal
                    title="SETTINGS"
                    show={this.state.settingsModal}
                    closeModal={() => this.setState({settingsModal: false})}
                    hardMode={{state: this.state.hardMode, onChange: this.switchChangeFactory("hardMode")}}
                    darkMode={{state: this.state.darkMode, onChange: this.setDarkMode}}
                    highContrastMode={{state: this.state.highContrastMode, onChange: this.highContrastChange}}
                    dailyNerdle={{state: this.state.dailyNerdle, onChange: this.setDailyNerdle}}
                    wordleWordList={{state: this.state.wordleWordlist, onChange: this.setWordList}}
                    theme={this.state.theme}
                />
            </div>
        );
    }
}
