import React from "react";
import styles from '../../css/Event.module.css'
import { IconGripHorizontal, IconPencil } from "@tabler/icons-react";
import { CSS } from "@dnd-kit/utilities"
import commonStyles from '../../css/Common.module.css'
import { useSortable } from "@dnd-kit/sortable";

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
        <div ref={setNodeRef} style={style} className={styles.eventItemContainer}>
            <button className={`${commonStyles.iconBtn} ${styles.dragHandle}`} {...listeners} {...attributes}><IconGripHorizontal /></button>
            <div>{props.eventName}</div>
            <div>{props.location}</div>
            <button className={`${commonStyles.iconBtn} ${commonStyles.eventEditBtn}`}><IconPencil /></button>
        </div>
    )
}