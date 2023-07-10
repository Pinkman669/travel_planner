import React from "react";
import styles from '../../css/Event.module.css'
import { IconPencil } from "@tabler/icons-react";
// import { useDraggable } from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities"
import commonStyles from '../../css/Common.module.css'
import { useSortable } from "@dnd-kit/sortable";

// interface EventItem {
//     id: number;
//     date: Date;
//     time: Date;
//     location: string;
//     business_hours: string;
//     phone: string;
//     website: string;
//     budget: number;
//     expense: number;
//     trip_id: number;
//     category: string;
//     order: number;
//     day: number;
// }

interface EventItemProps {
    id: number;
    eventName: string;
    location: string;
    date: Date;
}

export default function Event(props: EventItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.eventItemContainer}>
            <div>{props.eventName}</div>
            <div>{props.location}</div>
            <button className={`${commonStyles.iconBtn} ${commonStyles.eventEditBtn}`}><IconPencil /></button>
        </div>
    )
}