import React, {ReactNode} from "react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import {PlayerStats} from "../Models";
import "./Modals.css";
import Modal from "react-bootstrap/Modal";

interface StatsModalProps extends CommonModalProps {
    stats: PlayerStats;
}

interface StatDisplayProps {
    value: number;
    name: string;
}

function StatDisplay(props: StatDisplayProps) {
    return (
      <div className="statCell">
          <div className="statValue">{props.value}</div>
          <div className="statName">{props.name}</div>
      </div>
    );
}

interface GuessDistributionProps {
    winDistribution: number[];
}

function asPercentage(top: number, bottom: number): string {
    const percent = (bottom > 0) ? Math.round((top/bottom) * 100) : 0;
    return String(percent) + "%";
}

function GuessDistribution(props: GuessDistributionProps) {
    let mostGuesses: number = props.winDistribution.reduce((max, i) => (i > max) ? i : max, 0);

    const rows: Array<ReactNode> = props.winDistribution.map((value, key) => {
        return (
            <div className="graphContainer" key={key}>
                <div className="graphLabel">{key + 1}</div>
                <div className="graphBar" style={{width: asPercentage(value, mostGuesses)}}>
                    <div className="graphBarLabel">{value}</div>
                </div>
            </div>
        );
    });

    return <div>{rows}</div>;
}

export function StatsModal(props: StatsModalProps) {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <div className="cellRow statsRow">
                <StatDisplay value={props.stats.played} name="Played"/>
                <StatDisplay value={props.stats.getWinPercent()} name="Win %"/>
                <StatDisplay value={props.stats.currentStreak} name="Current Streak"/>
                <StatDisplay value={props.stats.maxStreak} name="Max Streak"/>
            </div>
            <br/>
            <div>
                <Modal.Title className="modalTitle">GUESS DISTRIBUTION</Modal.Title>
                <GuessDistribution winDistribution={props.stats.winDistribution}/>
            </div>
        </CommonModal>
    );
}
