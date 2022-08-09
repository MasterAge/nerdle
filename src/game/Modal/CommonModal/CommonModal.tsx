import React, {ReactNode} from "react";
import Modal from "react-bootstrap/Modal"
import './CommonModal.css';

export interface CommonModalProps {
    children?: ReactNode,
    title: string,
    show: boolean,
    closeModal: () => void,
}

export function CommonModal(props: CommonModalProps) {
    return (
        <Modal
            show={props.show}
            onHide={props.closeModal}
            backdropClassName="modalContainer"
            centered={true}
        >
            <Modal.Header closeButton className="modalHeader">
                <Modal.Title className="modalTitle">{props.title.toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
        </Modal>
    );
}
