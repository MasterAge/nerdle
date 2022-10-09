/** @jsxImportSource @emotion/react */
import React, {ReactNode} from "react";
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import {KeyState, LetterStates} from "../Models";
import {ColourTheme, GameTheme, getColour} from "../Style";
import {css, keyframes} from "@emotion/react";
import styled from "@emotion/styled";

const revealFrames = (color: string, startingColor: string) =>  keyframes`
  0% {
    background-color: ${startingColor};
  }
  99% {
    background-color: ${startingColor};
  }
  100% {
    background-color: ${color};
  }
`

const baseLetter = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  font-weight: bold;
  user-select: none;

  width: 44px;
  height: 64px;
  margin: 4px;

  @media (max-height: 580px) {
      height: 44px;
  }
`;

interface KeyProps {
    children: ReactNode,
    onClick: () => void,
    className?: string,
    state: LetterStates,
    theme?: GameTheme
}

function Key(props: KeyProps) {
    let backgroundColour: string = "";
    let animation = undefined;

    if (props.theme) {
        if (props.state != LetterStates.BASE) {
            backgroundColour = getColour(props.state, props.theme.colourTheme);
            animation = css`
              animation: ${revealFrames(backgroundColour, props.theme.accents)} 1600ms linear 0ms both;
            `;
        } else {
            backgroundColour = props.theme.accents;
        }
    }

    const background = css`
      background-color: ${backgroundColour};
      ${animation};
    `;

    return (
        <span css={[baseLetter, background]} className={props.className} onClick={props.onClick}>
            {props.children}
        </span>
    );
}

const SpecialKey = styled(Key)`
  width: 64px;
  background: lightgrey;
`;

const BackspaceKey = styled(SpecialKey)`
  font-size: 30px;
  line-height: 65px;
`;

const stateClasses: Map<LetterStates, string> = new Map([
    [LetterStates.INCORRECT, "incorrectLetter"],
    [LetterStates.CLOSE, "closeLetter"],
    [LetterStates.CORRECT, "correctLetter"],
]);

export interface KeyboardProps {
    keystate: Map<string, KeyState>;
    keyboardLayout: Array<Array<string>>;
    enterClicked: () => void;
    backspaceClicked: () => void;
    theme: GameTheme;
}

export function Keyboard(props: KeyboardProps) {
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
                    state={keyState.state}
                    theme={props.theme}
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
                <SpecialKey onClick={props.enterClicked} state={LetterStates.BASE}
                            css={css`background-color: ${props.theme.accents}`}>
                    Enter
                </SpecialKey>
                {keyCells[2]}
                <BackspaceKey onClick={props.backspaceClicked} state={LetterStates.BASE}
                              css={css`background-color: ${props.theme.accents}`}>
                    <BackspaceOutlinedIcon/>
                </BackspaceKey>
            </div>
        </div>
    )
}
