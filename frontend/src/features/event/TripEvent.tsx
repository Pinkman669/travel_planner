import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";

interface EventItem{
    id: number;
    name: string;
}

export default function TripEvent(){
    const {tripId} = useParams()
    const tripInfo = useAppSelector(state => state.trip.tripItems.find((item) => item.id === Number(tripId)))
    return (
        <div>
            This is event: {tripInfo?.name}
        </div>
    )
}