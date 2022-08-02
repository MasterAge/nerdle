import React from "react";
import './NavBar.css';
import { BsList, BsQuestionCircle, BsFileBarGraph, BsGearFill, BsArrowCounterclockwise } from "react-icons/bs";

interface NavProps {
    newGame: () => void,
}

export class NavBar extends React.Component<NavProps> {

    render() {
        return (
            <div className="nav-bar">
                <div>
                    <BsList className="nav-icon"/>
                    <BsQuestionCircle className="nav-icon"/>
                    <BsArrowCounterclockwise className="nav-icon" onClick={this.props.newGame}/>
                </div>
                <div className="title">
                    Nerdle
                </div>
                <div>
                    <span className="icon-padding"/>
                    <BsFileBarGraph className="nav-icon"/>
                    <BsGearFill className="nav-icon"/>
                </div>
            </div>
        );
    }
}
