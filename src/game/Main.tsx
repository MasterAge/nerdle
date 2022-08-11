import React from "react";
import {NavBar} from "./NavBar/NavBar";
import {LetterDisplay} from "./LetterDisplay/LetterDisplay";
import './Main.css';
import {Keyboard} from "./Keyboard/Keyboard";
import {KeyState, LetterState, LetterStates, loadStats, PlayerStats, saveStats, MAX_ATTEMPTS} from "./Models";
import {Popup} from "./Popup/Popup";
import {HelpModal} from "./Modal/HelpModal";
import {StatsModal} from "./Modal/StatsModal";
import {SettingsModal} from "./Modal/SettingsModal";

function objectArray<Type>(numElements: number, elementFactory: () => Type): Array<Type> {
    return new Array(numElements).fill(null).map(elementFactory);
}

interface MainState {
    guesses: Array<Array<LetterState>>;
    keyboard: Map<string, KeyState>;
    popupList: Array<string>;
    statsModal: boolean;
    helpModal: boolean;
    settingsModal: boolean;
    hardMode: boolean;
    darkMode: boolean;
    highContrastMode: boolean;
}

export class Main extends React.Component<{}, MainState> {
    LOWERCASE_ALPHABET: string = "abcdefghijklmnopqrstuvwxyz";
    KEYBOARD_LAYOUT: Array<Array<string>> = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M"]
    ];
    SUCCESS_MESSAGE: Array<string> = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];

    wordList: Array<string>;
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

        this.playerStats = loadStats();

        fetch("5letter_upper.txt").then(response => {
            response.text().then(content => {
                this.wordList = content.split("\n");
                this.pickWord();
            })
        });
        this.state = this.reset();
        console.log(typeof this.state.guesses)
    }

    reset = (setState: boolean = false): MainState => {
        const guesses: Array<Array<LetterState>> = objectArray(MAX_ATTEMPTS,
            () => objectArray(5, () => new LetterState("")));

        const keyboard = new Map(this.KEYBOARD_LAYOUT.flat().map(key => [key, new KeyState(key, this.guessFactory(key))]));

        const state = {
            guesses: guesses,
            keyboard: keyboard,
            popupList: [],
            helpModal: false,
            settingsModal: false,
            statsModal: false,
            hardMode: false,
            darkMode: false,
            highContrastMode: false,
        };

        if (setState) {
            this.setState(state);
        }

        if (this.wordList.length > 0) {
            this.pickWord();
        }
        this.lettersEntered = 0;
        this.attempt = 0;

        return state;
    }

    pickWord = () => {
        this.word = this.wordList[Math.floor(Math.random() * this.wordList.length)];
        this.addPopup(this.word);
    }

    submit = () => {
        const guessedWord = this.state.guesses[this.attempt]
            .map(letterState => letterState.name)
            .join("");

        if (this.lettersEntered == 5 && this.wordList.includes(guessedWord)) {
            const keyboardState = this.state.keyboard;
            const guesses = this.state.guesses;

            guesses[this.attempt].forEach((letterState, index) => {
                const letter = letterState.name;
                const keyState = keyboardState.get(letter)
                if (!keyState) {
                    return;
                }

                if (letter == this.word[index]) {
                    letterState.state = LetterStates.CORRECT;
                } else if (!this.word.includes(letter)) {
                    letterState.state = LetterStates.INCORRECT;
                } else {
                    letterState.state = LetterStates.CLOSE;
                }

                if (keyState.state != LetterStates.CORRECT) {
                    keyState.state = letterState.state;
                }
            });

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
            setTimeout(() => this.setState({statsModal: true}), 1000);

            saveStats(this.playerStats);

        } else if (!this.wordList.includes(guessedWord)) {
            this.addPopup("Not in word list")
        } else if (this.lettersEntered > 0) {
            this.addPopup("Not enough letters");
        }
    }

    backspace = () => {
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

    switchChangeFactory = (key: keyof MainState) => {
        return (event: React.ChangeEvent<HTMLInputElement>) =>
                this.setState({[key]: event.target.checked} as unknown as Pick<MainState, keyof MainState>)
    }

    render() {
        return (
            <div className="gameContainer">
                <NavBar
                    newGame={() => this.reset(true)}
                    help={() => this.setState({helpModal: true})}
                    stats={() => this.setState({statsModal: true})}
                    settings={() => this.setState({settingsModal: true})}
                />
                <LetterDisplay cells={this.state.guesses}/>
                <Keyboard
                    keystate={this.state.keyboard}
                    keyboardLayout={this.KEYBOARD_LAYOUT}
                    enterClicked={this.submit}
                    backspaceClicked={this.backspace}
                />
                <div className="popup-container">
                    {this.state.popupList.map((message, index) =>
                        <Popup removeMe={this.removePopup} duration_ms={3000} index={index} key={index}>
                            {message}
                        </Popup>)}
                </div>
                <HelpModal
                    title={"How to play"}
                    show={this.state.helpModal}
                    closeModal={() => this.setState({helpModal: false})}/>
                <StatsModal
                    title={"STATISTICS"}
                    show={this.state.statsModal}
                    closeModal={() => this.setState({statsModal: false})}
                    stats={this.playerStats}/>
                <SettingsModal
                    title="SETTINGS"
                    show={this.state.settingsModal}
                    hardModeState={this.state.hardMode}
                    darkModeState={this.state.darkMode}
                    highContrastModeState={this.state.highContrastMode}
                    closeModal={() => this.setState({settingsModal: false})}
                    hardModeChange={this.switchChangeFactory("hardMode")}
                    darkModeChange={this.switchChangeFactory("darkMode")}
                    highContrastModeChange={this.switchChangeFactory("highContrastMode")}
                />
            </div>
        );
    }
}
