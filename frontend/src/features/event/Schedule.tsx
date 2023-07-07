import React from "react";
import styles from '../../css/Schedule.module.css'

interface ScheduleProps{
    tripName: string;
    userName: string;
}

export default function Schedule(props: ScheduleProps){
    return (
        <div id={styles.scheduleContainer}>
            <div id={styles.ScheduleHeader}>
                <h3 id={styles.tripTitle}>{props.tripName}</h3>
                <div>{props.userName}</div>
            </div>
            <div id={styles.ScheduleLine}></div>
            <div id={styles.allDaysContainer}>
                <div className={styles.dayContainer}>
                    
                </div>
            </div>
        </div>
    )
}