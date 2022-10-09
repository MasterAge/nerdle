/** @jsxImportSource @emotion/react */
import React, {ReactNode} from "react";
import {Dialog, DialogContent, DialogTitle, IconButton, Slide} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from "@mui/material/transitions";
import {css} from "@emotion/react";
import {GameTheme} from "../../Style";

function getCommonStyle(theme: GameTheme) {
    return css`
        background-color: ${theme.background};
        color: ${theme.text}
    `
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

export interface CommonModalProps {
    children?: ReactNode,
    title: string,
    show: boolean,
    closeModal: () => void,
    theme: GameTheme,
}

export function CommonModal(props: CommonModalProps) {
    return (
        <Dialog
            onClose={props.closeModal}
            open={props.show}
            fullWidth={true}
            maxWidth={"sm"}
            TransitionComponent={Transition}
        >
            <DialogTitle css={css`text-align: center; ${getCommonStyle(props.theme)}`}>
                {props.title.toUpperCase()}
                <IconButton
                    aria-label="close"
                    onClick={props.closeModal}
                    sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500]}}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent css={getCommonStyle(props.theme)}>{props.children}</DialogContent>
        </Dialog>
    );
}
