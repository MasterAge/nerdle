import React from "react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import {Switch} from "@mui/material";

interface SettingProps {
    name: string;
    description?: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Setting(props: SettingProps) {
    return (
        <div>
            <div className="settingLine">
                <div>
                    <div className="settingName">{props.name}</div>
                    <div className="settingDescription">{props.description}</div>
                </div>
                <Switch
                    checked={props.checked}
                    onChange={props.onChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
            <hr/>
        </div>
    )
}

interface SettingsModalProps extends CommonModalProps{
    hardModeState: boolean;
    hardModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    darkModeState: boolean;
    darkModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    highContrastModeState: boolean;
    highContrastModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SettingsModal(props: SettingsModalProps) {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <Setting
                name="Hard Mode"
                description="Any revealed hints must be used in subsequent guesses"
                checked={props.hardModeState}
                onChange={props.hardModeChange}
            />
            <Setting
                name="Dark Mode"
                checked={props.darkModeState}
                onChange={props.darkModeChange}
            />
            <Setting
                name="High Contrast Mode"
                description="For improved color vision"
                checked={props.highContrastModeState}
                onChange={props.highContrastModeChange}
            />
        </CommonModal>
    );
}
