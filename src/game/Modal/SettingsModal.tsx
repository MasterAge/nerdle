import React from "react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import {Switch} from "@mui/material";
import {ColourTheme} from "../Style";
import styled from "@emotion/styled";

interface StyledSwitchProps {
    theme: ColourTheme;
}

// Copied from the MUI docs: https://mui.com/material-ui/react-switch/#customization ant style
const IOSSwitch = styled(Switch)<StyledSwitchProps>(props => ({
    width: 36,
    height: 18,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(13px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(17px)',
            color: '#ffffff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: props.theme.colors.correct,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 14,
        height: 14,
        borderRadius: 7,
        transition: 'width 200ms',
    },
    '& .MuiSwitch-track': {
        borderRadius: 18 / 2,
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

export interface SettingModel {
    state: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SettingProps {
    name: string;
    description?: string;
    model: SettingModel
    theme: ColourTheme;
}

export function Setting(props: SettingProps) {
    return (
        <div>
            <div className="settingLine">
                <div>
                    <div className="settingName">{props.name}</div>
                    <div className="settingDescription">{props.description}</div>
                </div>
                <IOSSwitch
                    checked={props.model.state}
                    onChange={props.model.onChange}
                    inputProps={{ 'aria-label': 'ant design' }}
                    theme={props.theme}
                />
            </div>
            <hr/>
        </div>
    )
}

interface SettingsModalProps extends CommonModalProps {
    hardMode: SettingModel;
    darkMode: SettingModel;
    highContrastMode: SettingModel;
    dailyNerdle: SettingModel;

    theme: ColourTheme;
}

export function SettingsModal(props: SettingsModalProps) {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <Setting
                name="Hard Mode"
                description="Any revealed hints must be used in subsequent guesses"
                model={props.hardMode}
                theme={props.theme}
            />
            <Setting
                name="Dark Mode"
                description="Turn the lights off"
                model={props.darkMode}
                theme={props.theme}
            />
            <Setting
                name="High Contrast Mode"
                description="For improved color vision"
                model={props.highContrastMode}
                theme={props.theme}
            />
            <Setting
                name="Daily Nerdle"
                description="One word per day, same word as Wordle"
                model={props.dailyNerdle}
                theme={props.theme}
            />
        </CommonModal>
    );
}
