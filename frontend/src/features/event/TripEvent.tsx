import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import { differenceInDays, addDays  } from 'date-fns'
import styles from '../../css/TripEvent.module.css'

interface EventItem{
    id: number;
    name: string;
}

export default function TripEvent(){
    const {tripId} = useParams()
    const tripInfo = useAppSelector(state => state.trip.tripItems.find((item) => item.id === Number(tripId)))
    const userName = useAppSelector(state => state.auth.name)

    function calculateNumberOfDays(){
        const numberOfDays = differenceInDays(new Date(tripInfo?.end_date as Date), new Date(tripInfo?.start_date as Date))
        const startDate = new Date(tripInfo?.start_date as Date)
        const arrOfTripDate = []
        for (let i = 0; i < numberOfDays; i++){
            arrOfTripDate.push(addDays(startDate, i))
        }
        return arrOfTripDate
    }

    return (
        <div className={`container-fluid`}>
            This is event: {tripInfo?.name}
            <Schedule numberOfDays={calculateNumberOfDays()} tripName={tripInfo?.name as string} userName={userName as string}/>
        </div>
    )
}