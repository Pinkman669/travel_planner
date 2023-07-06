import React from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "../../css/Home.module.css"
import { IconX } from "@tabler/icons-react";

interface DeleteConfirmProps{
    showModal: boolean;
    setShowModal: () => void
    tripName: string;
    onRemove: () => void
}

export default function DeleteConfirmModal(props: DeleteConfirmProps) {

    return (
        <Modal
            show={props.showModal}
            onHide={props.setShowModal}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className={styles.deleteConfirmModal}>
                <div>Are you sure you want to delete</div>
                <div className={styles.tripName}>{props.tripName} ?</div>
                <div className={styles.deleteConfirmModalBtn}>
                    <Button variant="dark" onClick={props.setShowModal}>Cancel</Button>
                    <Button variant="warning" onClick={props.onRemove}>Delete</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}