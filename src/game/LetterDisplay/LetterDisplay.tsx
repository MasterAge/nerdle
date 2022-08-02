import React from "react";
import './LetterDisplay.css';
import {LetterState, LetterStates} from "../Models";

interface LetterCellProps {
    letter: string,
    className?: string,
}

function LetterCell(props: LetterCellProps) {
    let extraClass = "";

    if (props.className === undefined) {
        extraClass = (props.letter.length == 0) ? "emptyCell" : "activeCell";
    } else {
        extraClass = props.className;
    }

    const className = "baseCell " + extraClass;
    return <div className={className}>{props.letter}</div>
}

const stateClasses: Map<LetterStates, string> = new Map([
    [LetterStates.INCORRECT, "incorrectLetterCell"],
    [LetterStates.CLOSE, "closeLetterCell"],
    [LetterStates.CORRECT, "correctLetterCell"],
]);

export interface LetterDisplayProps {
    cells: Array<Array<LetterState>>;
}

export function LetterDisplay(props: LetterDisplayProps) {
    const cellLists = props.cells.map((cellList, parentIndex) =>
        <div key={parentIndex} className="cellRow">
            {cellList.map((letterState,index) =>
                <LetterCell key={parentIndex*10 + index} letter={letterState.name}
                            className={stateClasses.get(letterState.state)}/>)}
        </div>
    );

    return (
        <div className="letterDisplay">
            {cellLists}
        </div>
    );
}
