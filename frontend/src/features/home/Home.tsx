import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Button, InputGroup, Modal } from "react-bootstrap";
import { logout } from "../auth/AuthSlice";
import styles from "../../css/Common.module.css"
import { IconPlus } from "@tabler/icons-react";

export default function Home() {
    const dispatch = useAppDispatch()
    const username = useAppSelector(state => state.auth.name)
    const [showModal, setShowModal] = useState(false)

    const onAddTrip = () => {
        if (showModal) {
            setShowModal(false)
        } else {
            setShowModal(true)
        }
    }

    return (
        <div className="container-fluid">
            <div className={styles.tripHeader}>
                <p id={styles.username}>{username}</p>
                <Button variant="light" onClick={() => dispatch(logout())}>Logout</Button>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.addTripItems}>
                    <button onClick={onAddTrip} className={styles.addTripBtn}>
                        <IconPlus />
                    </button>
                </div>
            </div>

            {/* modal */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal} onHide={onAddTrip}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onAddTrip}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onAddTrip}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}