import React from "react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import "./Modals.css";

export function HelpModal(props: CommonModalProps)  {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <p>Guess the NERDLE in 6 tries.</p>
            <p>Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
            <p>After each guess, the color of the tiles will change to show how close
                your guess was to the word.</p>
            <hr/>
            <p><b>Examples</b></p>
            <div className="cellRow modalCellRow">
                <div className="baseCell correctLetterCell revealedLetter">W</div>
                <div className="baseCell activeCell">E</div>
                <div className="baseCell activeCell">A</div>
                <div className="baseCell activeCell">R</div>
                <div className="baseCell activeCell">Y</div>
            </div>
            <p>The letter W is in the word and in the correct spot.</p>
            <div className="cellRow modalCellRow">
                <div className="baseCell activeCell">P</div>
                <div className="baseCell closeLetterCell revealedLetter">I</div>
                <div className="baseCell activeCell">L</div>
                <div className="baseCell activeCell">L</div>
                <div className="baseCell activeCell">S</div>
            </div>
            <p>The letter I is in the word but in the wrong spot.</p>

            <div className="cellRow modalCellRow">
                <div className="baseCell activeCell">V</div>
                <div className="baseCell activeCell">A</div>
                <div className="baseCell activeCell">G</div>
                <div className="baseCell incorrectLetterCell revealedLetter">U</div>
                <div className="baseCell activeCell">E</div>
            </div>
            <p>The letter U is not in the word in any spot.</p>
        <br/>
        </CommonModal>
    );
}
