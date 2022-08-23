/** @jsxImportSource @emotion/react */
import React from "react";
import {css} from "@emotion/react";

import './LetterDisplay.css';
import {LetterState, LetterStates} from "../Models";
import {getColour, ColourTheme} from "../Style";

const baseCell = css({
    width: "60px",
    height: "60px",
    margin: "2px",

    fontWeight: "bold",
    fontSize: "28px",
    lineHeight: "60px",

    textAlign: "center",
})

const activeCell = css({animation: "pop 0.1s linear"})

interface LetterCellProps {
    letter: string,
    letterState: LetterStates,
    theme: ColourTheme
}

export function LetterCell(props: LetterCellProps) {
    const theme = props.theme;
    let extraClasses = [];
    let borderColor = "";
    let backgroundColor = "";

    if (props.letterState == LetterStates.BASE) {
        if (props.letter.length == 0) {
            borderColor = "lightgrey";
        } else {
            borderColor = "grey";
            extraClasses.push(activeCell);
        }
    } else {
        borderColor = getColour(props.letterState, theme);
        backgroundColor = borderColor;
    }

    extraClasses.push({
        border: `2px solid ${borderColor}`,
        backgroundColor: backgroundColor
    })

    return <div css={[baseCell, extraClasses]}>{props.letter}</div>;
}

export interface LetterDisplayProps {
    cells: Array<Array<LetterState>>;
    theme: ColourTheme;
}

export function LetterDisplay(props: LetterDisplayProps) {
    const cellLists = props.cells.map((cellList, parentIndex) =>
        <div key={parentIndex} className="cellRow">
            {cellList.map((letterState, index) =>
                <LetterCell key={parentIndex * 10 + index} letter={letterState.name}
                            letterState={letterState.state}
                            theme={props.theme}/>)}
        </div>
    );

    return (
        <div className="letterDisplay">
            {cellLists}
        </div>
    );
}
