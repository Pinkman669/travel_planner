import React from "react";
import styles from '../../css/Schedule.module.css'
import Day from "./Day";

interface ScheduleProps{
    tripName: string;
    userName: string;
    arrOfTripDate: Date[];
    tripId: number;
}

export default function Schedule(props: ScheduleProps){
    const arrOfTripDate = props.arrOfTripDate
    return (
        <div id={styles.scheduleContainer}>
            <div id={styles.ScheduleHeader}>
                <h3 id={styles.tripTitle}>{props.tripName}</h3>
                <div>{props.userName}</div>
            </div>
            <div id={styles.ScheduleLine}></div>
            <div id={styles.allDaysContainer}>
                    {arrOfTripDate.map((date, index) =>(
                        <Day key={index+date.toString()} dayNumber={index+1} date={date} tripId={props.tripId}/>
                    ))}
            </div>
        </div>
    )
}