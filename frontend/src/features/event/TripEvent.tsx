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
    const screenWidth = window.innerWidth
    const isLargeScreen = window.innerWidth > 450

    return (
        <div className="container-fluid">
            <div className={styles.TripEventHeader}>
                <Button variant="light">
                    <Link to='/' id='sign-up-link'><IconCornerUpLeft /></Link>
                </Button>
                {
                    screenWidth <= 450 && <Button id={styles.mapBtn} variant="dark" onClick={handleShow}>Map</Button>
                }
            </div>
            <div className={`${styles.TripEventContainer}`}>
                <Schedule isLargeScreen={isLargeScreen} screenWidth={screenWidth} tripId={Number(tripId)} tripName={tripInfo?.name as string} userName={userName as string} />
                {
                    screenWidth <= 450 ?
                        <Offcanvas show={show} onHide={handleClose} placement="end">
                            <Offcanvas.Body>
                                <Feature onClose={handleClose} screenWidth={screenWidth}/>
                            </Offcanvas.Body>
                        </Offcanvas>
                        : <Feature />
                }
            </div>
        </div>
    )
}