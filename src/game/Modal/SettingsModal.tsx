import React from "react";
import {css} from "@emotion/react";
import {CommonModal, CommonModalProps} from "./CommonModal/CommonModal";
import {createTheme, styled, Switch} from "@mui/material";
import {ColourTheme} from "../Style";

// Copied from the MUI docs: https://mui.com/material-ui/react-switch/#customization ant style
const IOSSwitch = styled(Switch)(({ theme }) => ({
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
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: (theme as unknown as ColourTheme).colors.correct,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 14,
        height: 14,
        borderRadius: 7,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 18 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));


interface SettingProps {
    name: string;
    description?: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
                    checked={props.checked}
                    onChange={props.onChange}
                    inputProps={{ 'aria-label': 'ant design' }}
                    theme={createTheme(undefined, props.theme)}
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

    theme: ColourTheme
}

export function SettingsModal(props: SettingsModalProps) {
    return (
        <CommonModal title={props.title} show={props.show} closeModal={props.closeModal}>
            <Setting
                name="Hard Mode"
                description="Any revealed hints must be used in subsequent guesses"
                checked={props.hardModeState}
                onChange={props.hardModeChange}
                theme={props.theme}
            />
            <Setting
                name="Dark Mode"
                checked={props.darkModeState}
                onChange={props.darkModeChange}
                theme={props.theme}
            />
            <Setting
                name="High Contrast Mode"
                description="For improved color vision"
                checked={props.highContrastModeState}
                onChange={props.highContrastModeChange}
                theme={props.theme}
            />
        </CommonModal>
    );
}
