import React, {ReactNode} from "react";
import {NavBar} from "./NavBar/NavBar";
import {LetterDisplay} from "./LetterDisplay/LetterDisplay";
import './Main.css';
import {Keyboard} from "./Keyboard/Keyboard";
import {KeyState, LetterState, LetterStates} from "./Models";
import {Popup} from "./Popup/Popup";

function objectArray<Type>(numElements: number, elementFactory: () => Type): Array<Type> {
    return new Array(numElements).fill(null).map(elementFactory);
}

interface MainState {
    guesses: Array<Array<LetterState>>;
    keyboard: Map<string, KeyState>;
    popupList: Array<string>
}

export class Main extends React.Component<{}, MainState> {
    MAX_ATTEMPTS: number = 6;
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

    constructor(props: Readonly<{}>) {
        super(props);
        this.attempt = 0;
        this.lettersEntered = 0;
        this.word = "";
        this.wordList = [];

        fetch("5letter_upper.txt").then(response => {
            response.text().then(content => {
                this.wordList = content.split("\n");
                this.pickWord();
            })
        });

        // const guesses: Array<Array<LetterState>> = objectArray(this.MAX_ATTEMPTS,
        //     () => objectArray(5, () => new LetterState("")));
        //
        // const keyboard = new Map(this.KEYBOARD_LAYOUT.flat().map(key => [key, new KeyState(key, this.guessFactory(key))]));
        //
        // this.state = {
        //     guesses: guesses,
        //     keyboard: keyboard,
        //     popupList: []
        // };
        this.state = this.reset();
    }

    reset = (setState: boolean = false): MainState => {
        const guesses: Array<Array<LetterState>> = objectArray(this.MAX_ATTEMPTS,
            () => objectArray(5, () => new LetterState("")));

        const keyboard = new Map(this.KEYBOARD_LAYOUT.flat().map(key => [key, new KeyState(key, this.guessFactory(key))]));

        const state = {
            guesses: guesses,
            keyboard: keyboard,
            popupList: []
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

            if (guessedWord == this.word) {
                this.addPopup(this.SUCCESS_MESSAGE[this.attempt])
            } else {
                this.setState({keyboard: keyboardState, guesses: guesses})
                this.lettersEntered = 0;
                this.attempt++;
            }
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
        if (this.lettersEntered < 5 && this.attempt < this.MAX_ATTEMPTS) {
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
        // If the index is too big, remove the first popup (likely the oldest).
        const toRemove = Math.min(popupList.length - 1, index);
        popupList.splice(toRemove, 1)
        this.setState({popupList: popupList})
    }

    render() {
        return (
            <div className="gameContainer">
                <NavBar newGame={this.reset}/>
                <LetterDisplay cells={this.state.guesses}/>
                <Keyboard
                    keystate={this.state.keyboard}
                    keyboardLayout={this.KEYBOARD_LAYOUT}
                    enterClicked={this.submit}
                    backspaceClicked={this.backspace}
                />
                <div className="popup-container">
                    {this.state.popupList.map((message, index) =>
                        <Popup removeMe={this.removePopup}
                               duration_ms={3000}
                               index={index}
                               key={index}
                        >
                            {message}
                        </Popup>)}
                </div>
            </div>
        );
    }
}
