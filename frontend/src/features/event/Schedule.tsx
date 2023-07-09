import React from "react";
import styles from '../../css/Schedule.module.css'
import Day from "../home/Day";

interface ScheduleProps{
    tripName: string;
    userName: string;
    numberOfDays: Date[];
}

export default function Schedule(props: ScheduleProps){
    const numberOfDays = props.numberOfDays
    console.log(numberOfDays)
    return (
        <div id={styles.scheduleContainer}>
            <div id={styles.ScheduleHeader}>
                <h3 id={styles.tripTitle}>{props.tripName}</h3>
                <div>{props.userName}</div>
            </div>
            <div id={styles.ScheduleLine}></div>
            <div id={styles.allDaysContainer}>
                    <Day />
                    <Day />
                    <Day />
            </div>
        </div>
    )
}