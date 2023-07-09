import React from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'
import { useEventItem } from "./EventAPI";
import { isSameDay } from "date-fns";

interface DayItemProps{
    tripId: number;
    date: Date;
    dayNumber: number;
}

export default function Day(props: DayItemProps){
    const eventList = useEventItem(props.tripId)
    const currentDateList = eventList.filter((event) => {
        return isSameDay(new Date(event.date), props.date)
    })

    return (
        <div className={styles.dayContainer}>
            <div className={styles.dayHeader}>
                <div>Day {props.dayNumber}</div>
                <div>{(props.date).toDateString()}</div>
            </div>
            <div className={styles.eventContainer}>
                {
                    currentDateList.map((event) => (
                        <Event key={event.id} eventName={event.name} location={event.location} date={event.date}/>
                    ))
                }
            </div>
        </div>
    )
}