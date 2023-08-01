import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { Link, useParams } from "react-router-dom";
import Schedule from "./Schedule";
import Feature from "../featureContainer/Feature";
import styles from '../../css/TripEvent.module.css'
import { Button, Offcanvas } from "react-bootstrap";
import { IconCornerUpLeft } from "@tabler/icons-react";

export default function TripEvent() {
    const { tripId } = useParams()
    const tripInfo = useAppSelector(state => state.trip.tripItems.find((item) => item.id === Number(tripId)))
    const userName = useAppSelector(state => state.auth.name)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const isLargeScreen = window.innerWidth > 450

    return (
        <div className="container-fluid">
            <div className={styles.TripEventHeader}>
                <Link className="btn btn-light" to='/' id='sign-up-link'><IconCornerUpLeft /></Link>
                {
                    !isLargeScreen && <Button id={styles.mapBtn} variant="dark" onClick={handleShow}>Map</Button>
                }
            </div>
            <div className={`${styles.TripEventContainer}`}>
                <Schedule isLargeScreen={isLargeScreen} tripId={Number(tripId)} tripName={tripInfo?.name as string} userName={userName as string} />
                {
                    !isLargeScreen ?
                        <Offcanvas show={show} onHide={handleClose} placement="end">
                            <Offcanvas.Body>
                                <Feature onClose={handleClose} isLargeScreen={isLargeScreen} />
                            </Offcanvas.Body>
                        </Offcanvas>
                        : <Feature isLargeScreen={isLargeScreen} />
                }
            </div>
        </div>
    )
}