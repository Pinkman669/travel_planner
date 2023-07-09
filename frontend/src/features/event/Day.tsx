import React from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'

interface DayItemProps{
    date: Date;
    dayNumber: number;
}

export default function Day(props: DayItemProps){
    return (
        <div className={styles.dayContainer}>
            <div className={styles.dayHeader}>
                <div>Day {props.dayNumber}</div>
                <div>{(props.date).toDateString()}</div>
            </div>
            <div className={styles.eventContainer}>
                <Event />
            </div>
        </div>
    )
}