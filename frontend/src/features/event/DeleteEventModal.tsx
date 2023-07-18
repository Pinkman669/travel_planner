import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import styles from '../../css/DeleteEventModal.module.css'
import '../../css/Custom-BS.css'

interface DeleteEventModalProps {
    show: boolean;
    onClose: () => void;
    itemName: string;
    onRemove: () => void;
}

export default function DeleteEventModal(props: DeleteEventModalProps) {


    return (
        <div>
            <Modal
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={props.show}
                onHide={props.onClose}
                className={styles.deleteEventBackdrop}
            >
                <Modal.Body bsPrefix='delete-event-modal'>
                    <div className={styles.deleteTitle}>Are you sure you want to delete: </div>
                    <div className={styles.nameContainer}>

                        <div className={styles.eventName}>{props.itemName} ?</div>
                    </div>
                    <div className={styles.deleteConfirmModalBtn}>
                        <Button variant="dark" onClick={props.onClose}>Cancel</Button>
                        <Button variant="warning" onClick={props.onRemove}>Delete</Button>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    )
}