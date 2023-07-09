import React from "react";
import styles from '../../css/Event.module.css'

interface EventItem{
    id: number;
    date: Date;
    time: Date;
    location: string;
    business_hours: string;
    phone: string;
    website: string;
    budget: number;
    expense: number;
    trip_id: number;
    category: string;
    order: number;
    day: number;
}

interface EventItemProps{
    eventName: string;
    location: string;
    date: Date;
}

export default function Event(props: EventItemProps) {
    return (
        <div className={styles.eventItemContainer}>
            <div>{props.eventName}</div>
            <div>{props.location}</div>
        </div>
    )
}