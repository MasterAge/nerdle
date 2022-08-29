/** @jsxImportSource @emotion/react */
import React from "react";
import {css, keyframes} from "@emotion/react";

import './LetterDisplay.css';
import {LetterState, LetterStates} from "../Models";
import {getColour, ColourTheme} from "../Style";

const popFrames = keyframes`
  0% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
`;

const revealFrames = (color: string) =>  keyframes`
  0% {
    transform: rotateX(0);
    border-color: gray;
  }
  49% {
    background-color: unset;
    border-color: gray;
  }
  50% {
    background-color: ${color};
    border-color: ${color};
    transform: rotateX(90deg);
  }
  100% {
    background-color: ${color};
    border-color: ${color};
    transform: rotateX(0);
  }
`

const revealAnimFactory = (color: string) => css`
  &:nth-of-type(1) {
    animation: ${revealFrames(color)} 500ms linear 0ms both;
  }

  &:nth-of-type(2) {
    animation: ${revealFrames(color)} 500ms linear 300ms both;
  }

  &:nth-of-type(3) {
    animation: ${revealFrames(color)} 500ms linear 600ms both;
  }

  &:nth-of-type(4) {
    animation: ${revealFrames(color)} 500ms linear 900ms both;
  }

  &:nth-of-type(5) {
    animation: ${revealFrames(color)} 500ms linear 1200ms both;
  }
`

const baseCell = css({
    width: "60px",
    height: "60px",
    margin: "2px",

    fontWeight: "bold",
    fontSize: "28px",
    lineHeight: "60px",

    textAlign: "center",
})

const activeCell = css({animation: `${popFrames} 0.1s linear`})

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
    let animation = undefined;

    if (props.letterState == LetterStates.BASE) {
        if (props.letter.length == 0) {
            borderColor = "lightgrey";
        } else {
            borderColor = "grey";
            extraClasses.push(activeCell);
        }
    } else {
        const newColor = getColour(props.letterState, theme);
        animation = revealAnimFactory(newColor);
    }

    extraClasses.push(css`
        border: 2px solid ${borderColor};
        background-color: ${backgroundColor};
        ${animation}
    `);

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
                // Increase parent index by an order of magnitude
                // E.g. 1 => 10, 2 => 20 and thus [1][2] => 12
                <LetterCell key={parentIndex * 10 + index}
                            letter={letterState.name}
                            letterState={letterState.state}
                            theme={props.theme}
                />
            )}
        </div>
    );

    return (
        <div css={css`margin: auto;`}>
            {cellLists}
        </div>
    );
}
