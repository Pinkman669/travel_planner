import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import Feature from "../featureContainer/Feature";
import styles from '../../css/TripEvent.module.css'

export default function TripEvent() {
    const { tripId } = useParams()
    const tripInfo = useAppSelector(state => state.trip.tripItems.find((item) => item.id === Number(tripId)))
    const userName = useAppSelector(state => state.auth.name)

    return (
        <div className={`${styles.TripEventContainer} container-fluid`}>
            <Schedule tripId={Number(tripId)} tripName={tripInfo?.name as string} userName={userName as string} />
            <Feature />
        </div>
    )
}