import React, {ReactNode} from "react";
import "./Popup.css";

interface PopupProps {
    children: ReactNode,
    duration_ms: number,
    index: number,
    removeMe: (i: number) => void,
}

export class Popup extends React.Component<PopupProps> {
    componentDidMount() {
        if (this.props.duration_ms > 0) {
            setTimeout(() => this.props.removeMe(this.props.index), this.props.duration_ms)
        }
    }

    render() {
        return(
            <div className="popup">
                {this.props.children}
            </div>
        );
    }
}
