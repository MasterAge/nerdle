import React, {ReactNode} from "react";
import { BsBackspace } from "react-icons/bs";
import {KeyState, LetterStates} from "../Models";
import "./Keyboard.css";

interface KeyProps {
    children: ReactNode,
    onClick: () => void,
    className?: string
}

function Key(props: KeyProps) {
    return <span className={"baseLetter " + (props.className || "startingLetter")} onClick={props.onClick}>
        {props.children}
    </span>;
}

const stateClasses: Map<LetterStates, string> = new Map([
    [LetterStates.INCORRECT, "incorrectLetter"],
    [LetterStates.CLOSE, "closeLetter"],
    [LetterStates.CORRECT, "correctLetter"],
]);

export interface KeyboardProps {
    keystate: Map<string, KeyState>,
    keyboardLayout: Array<Array<string>>
    enterClicked: () => void,
    backspaceClicked: () => void
}

export function Keyboard (props: KeyboardProps) {
    const keyCells = props.keyboardLayout.map(row =>
        row.map(key => {
            const keyState = props.keystate.get(key);
            if (!keyState) {
                return;
            }
            return (
            <Key
                key={keyState.name}
                onClick={keyState.onClick}
                className={stateClasses.get(keyState.state)}
            >
                {keyState.name}
            </Key>)
        }))
    return (
        <div>
            <div className="cellRow">
                {keyCells[0]}
            </div>
            <div className="cellRow">
                {keyCells[1]}
            </div>
            <div className="cellRow">
                <Key className="specialKey" onClick={props.enterClicked}>Enter</Key>
                {keyCells[2]}
                <Key className="specialKey backSpace" onClick={props.backspaceClicked}>
                    <BsBackspace/>
                </Key>
            </div>
        </div>
    )
}