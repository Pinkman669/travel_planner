import styles from '../../css/Event.module.css'
import { IconGripHorizontal, IconPencil } from "@tabler/icons-react";
import { CSS } from "@dnd-kit/utilities"
import commonStyles from '../../css/Common.module.css'
import { useSortable } from "@dnd-kit/sortable";
import { EventItem } from '../utils/types';
import EventDetail from './EventDetail';
import { useState } from 'react';

interface EventItemProps {
    id: number;
    eventName: string;
    location: string;
    date: Date;
    eventItem: EventItem
}

export default function Event(props: EventItemProps) {
    const [showModal, setShowModal] = useState(false)
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <div ref={setNodeRef} style={style} className={styles.eventItemContainer}>
                <button onClick={handleShow}>showDetail</button>
                <button className={`${commonStyles.iconBtn} ${styles.dragHandle}`} {...listeners} {...attributes}><IconGripHorizontal /></button>
                <div>{props.eventName}</div>
                <button className={`${commonStyles.iconBtn} ${commonStyles.eventEditBtn}`}><IconPencil /></button>
            </div>
            <EventDetail onClose={handleClose} show={showModal} eventItem={props.eventItem} />
        </>
    )
}