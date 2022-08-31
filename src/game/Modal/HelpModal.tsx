/** @jsxImportSource @emotion/react */
import React from "react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import "./Modals.css";
import {LetterCell} from "../LetterDisplay/LetterDisplay";
import {LetterStates} from "../Models";
import {ColourTheme} from "../Style";
import {css} from "@emotion/react";

const modalCellRow = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(1, 68px);
  height: 68px;
  width: 336px;
  grid-gap: 4px;
  font-size: 30px;
`;

interface HelpModalProps extends CommonModalProps {
    theme: ColourTheme;
}

export function HelpModal(props: HelpModalProps)  {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <p>Guess the NERDLE in 6 tries.</p>
            <p>Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
            <p>After each guess, the color of the tiles will change to show how close
                your guess was to the word.</p>
            <hr/>
            <p><b>Examples</b></p>
            <div css={modalCellRow}>
                <LetterCell letter={"W"} letterState={LetterStates.CORRECT} theme={props.theme}/>
                <LetterCell letter={"E"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"A"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"R"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"Y"} letterState={LetterStates.BASE} theme={props.theme}/>
            </div>
            <p>The letter W is in the word and in the correct spot.</p>
            <div css={modalCellRow}>
                <LetterCell letter={"P"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"I"} letterState={LetterStates.CLOSE} theme={props.theme}/>
                <LetterCell letter={"L"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"L"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"S"} letterState={LetterStates.BASE} theme={props.theme}/>
            </div>
            <p>The letter I is in the word but in the wrong spot.</p>

            <div css={modalCellRow}>
                <LetterCell letter={"V"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"A"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"G"} letterState={LetterStates.BASE} theme={props.theme}/>
                <LetterCell letter={"U"} letterState={LetterStates.INCORRECT} theme={props.theme}/>
                <LetterCell letter={"E"} letterState={LetterStates.BASE} theme={props.theme}/>
            </div>
            <p>The letter U is not in the word in any spot.</p>
        <br/>
        </CommonModal>
    );
}
