import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
// import EventRoute from "../map/EventsRoute";
import Feature from "../featureContainer/Feature";

export default function TripEvent(){
    const {tripId} = useParams()
    const tripInfo = useAppSelector(state => state.trip.tripItems.find((item) => item.id === Number(tripId)))
    const userName = useAppSelector(state => state.auth.name)

    return (
        <div className={`container-fluid`}>
            <Schedule tripId={Number(tripId)} tripName={tripInfo?.name as string} userName={userName as string}/>
            <Feature/>
            {/* <EventRoute /> */}
        </div>
    )
}