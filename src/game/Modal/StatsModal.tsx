import React, {ReactNode} from "react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import {DialogTitle} from "@mui/material";
import {PlayerStats} from "../Models";
import "./Modals.css";
import Countdown from 'react-countdown';

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

/**
 * Retrieves the Date for midnight tonight, i.e. the start of the next day.
 */
function getMidnight(): Date {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), current.getDate(), 24)
}

interface StatsModalProps extends CommonModalProps {
    stats: PlayerStats;
    showTime: boolean;
}

export function StatsModal(props: StatsModalProps) {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <div className="cellRow">
                <StatDisplay value={props.stats.played} name="Played"/>
                <StatDisplay value={props.stats.getWinPercent()} name="Win %"/>
                <StatDisplay value={props.stats.currentStreak} name="Current Streak"/>
                <StatDisplay value={props.stats.maxStreak} name="Max Streak"/>
            </div>
            <div>
                <DialogTitle>GUESS DISTRIBUTION</DialogTitle>
                <GuessDistribution winDistribution={props.stats.winDistribution}/>
            </div>
            {props.showTime &&
            <div>
                <hr/>
                <DialogTitle>
                    NEXT NERDLE IN <Countdown date={getMidnight()} daysInHours={true}/>
                </DialogTitle>
            </div>
            }
        </CommonModal>
    );
}
