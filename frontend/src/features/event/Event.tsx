import styles from '../../css/Event.module.css'
import { IconArrowsMove } from "@tabler/icons-react";
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
    isLargeScreen: boolean;
}

export default function Event(props: EventItemProps) {
    const [showModal, setShowModal] = useState(false)
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id
    })
    const isLargeScreen = props.isLargeScreen
    let eventItemName: string
    if (isLargeScreen){
        eventItemName = props.eventName.length > 15 ? `${props.eventName.slice(0, 15)}...` : props.eventName
    } else {
        eventItemName = props.eventName.length > 8 ? `${props.eventName.slice(0, 8)}...` : props.eventName
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <div ref={setNodeRef} style={style} className={styles.eventItemContainer}>
                <button className={`${styles.detailBtn}`} onClick={handleShow}></button>
                <div className={styles.eventItemDiv}>
                    <div>
                        <div className={styles.eventItemName}>
                            {eventItemName}
                        </div>
                        <div className={styles.eventItemCategory}>
                            {`#${props.eventItem.category}`}
                        </div>
                    </div>
                    <button className={`${commonStyles.iconBtn} ${styles.dragHandle}`} {...listeners} {...attributes}><IconArrowsMove /></button>
                </div>
            </div>
            {showModal && <EventDetail onClose={handleClose} show={showModal} eventItem={props.eventItem} />}
        </>
    )
}