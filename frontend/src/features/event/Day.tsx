import React from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'
import { SortableContext } from "@dnd-kit/sortable";
import {EventItem} from './EventAPI'
import { useDroppable } from "@dnd-kit/core";

interface DayItemProps {
    tripId: number;
    date: string|Date;
    dayNumber: number;
    eventList: EventItem[]
    container: string;
}

export default function Day(props: DayItemProps) {
    const eventList = props.eventList
    const { setNodeRef } = useDroppable({
        id: props.container
      });

    return (
        <>
                <div className={styles.dayContainer}>
                    <div className={styles.dayHeader}>
                        <div>Day {props.dayNumber}</div>
                        <div>{new Date(props.date).toDateString()}</div>
                    </div>
                    <div className={styles.eventContainer}>
                        <SortableContext id={props.container} items={eventList}>
                            <div ref={setNodeRef}>
                                {  
                                    eventList.map((event) => (
                                        <Event key={event.id} id={event.id} eventName={event.name} location={event.location} date={event.date} />
                                    ))
                                }
                            </div>
                        </SortableContext>
                    </div>
                </div>
        </>
    )
}