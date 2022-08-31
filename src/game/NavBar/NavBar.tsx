import React from "react";
import './NavBar.css';

import { HelpOutline, PlayCircleFilledWhiteOutlined, Settings, LeaderboardOutlined } from '@mui/icons-material';

interface NavProps {
    newGame: () => void,
    help: () => void,
    stats: () => void,
    settings: () => void,
}

export function NavBar(props: NavProps) {
    return (
        <div className="nav-bar">
            <div>
                <HelpOutline className="nav-icon" onClick={props.help} fontSize={"large"}/>
                <PlayCircleFilledWhiteOutlined className="nav-icon" onClick={props.newGame} fontSize={"large"}/>
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
