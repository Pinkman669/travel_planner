import React from "react";
import styles from '../../css/Event.module.css'
import { IconPencil } from "@tabler/icons-react";
import commonStyles from '../../css/Common.module.css'

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
            <button className={`${commonStyles.iconBtn} ${commonStyles.eventEditBtn}`}><IconPencil/></button>
        </div>
    )
}