import React, {ReactNode} from "react";
import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import './CommonModal.css';

export interface CommonModalProps {
    children?: ReactNode,
    title: string,
    show: boolean,
    closeModal: () => void,
}

export function CommonModal(props: CommonModalProps) {
    return (
        <Dialog
            onClose={props.closeModal}
            open={props.show}
            fullWidth={true}
            maxWidth={"sm"}
        >
            <DialogTitle className="modalTitle">
                {props.title.toUpperCase()}
                <IconButton
                    aria-label="close"
                    onClick={props.closeModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>{props.children}</DialogContent>
        </Dialog>
    );
}
