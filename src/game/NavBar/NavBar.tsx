/** @jsxImportSource @emotion/react */
import React from "react";
import {css} from "@emotion/react";
import './NavBar.css';

import { HelpOutline, PlayCircleFilledWhiteOutlined, Settings, LeaderboardOutlined } from '@mui/icons-material';
import {GameTheme} from "../Style";

function navBarStyle(theme: GameTheme) {
    return css`
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0px 10px;
      font-size: 28px;

      border-bottom: ${theme.accents} 1px solid;
    `;
}


interface NavProps {
    newGame: () => void,
    help: () => void,
    stats: () => void,
    settings: () => void,

    showNewGame: boolean,
    theme: GameTheme,
}

export function NavBar(props: NavProps) {
    let playButton = <PlayCircleFilledWhiteOutlined className="nav-icon" onClick={props.newGame} fontSize={"large"}/>
    if (!props.showNewGame) {
        playButton = <PlayCircleFilledWhiteOutlined className="nav-icon hidden-icon" fontSize={"large"}/>;
    }
    return (
        <div css={navBarStyle(props.theme)}>
            <div>
                <HelpOutline className="nav-icon" onClick={props.help} fontSize={"large"}/>
                {playButton}
            </div>
            <div css={css`
                font-size: 34px;
                font-family: Anton, fantasy;
                text-align: center;
            `}>
                Nerdle
            </div>
            <div>
                <LeaderboardOutlined className="nav-icon" onClick={props.stats} fontSize={"large"}/>
                <Settings className="nav-icon" onClick={props.settings} fontSize={"large"}/>
            </div>
        </div>
    );
}
