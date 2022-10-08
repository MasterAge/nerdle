import React from "react";
import './NavBar.css';

import { HelpOutline, PlayCircleFilledWhiteOutlined, Settings, LeaderboardOutlined } from '@mui/icons-material';

interface NavProps {
    newGame: () => void,
    help: () => void,
    stats: () => void,
    settings: () => void,

    showNewGame: boolean,
}

export function NavBar(props: NavProps) {
    let playButton = <PlayCircleFilledWhiteOutlined className="nav-icon" onClick={props.newGame} fontSize={"large"}/>
    if (!props.showNewGame) {
        playButton = <PlayCircleFilledWhiteOutlined className="nav-icon hidden-icon" fontSize={"large"}/>;
    }
    return (
        <div className="nav-bar">
            <div>
                <HelpOutline className="nav-icon" onClick={props.help} fontSize={"large"}/>
                {playButton}
            </div>
            <div className="title">
                Nerdle
            </div>
            <div>
                <LeaderboardOutlined className="nav-icon" onClick={props.stats} fontSize={"large"}/>
                <Settings className="nav-icon" onClick={props.settings} fontSize={"large"}/>
            </div>
        </div>
    );
}
