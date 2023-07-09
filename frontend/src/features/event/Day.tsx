import React from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'
import { useEventItem } from "./EventAPI";
import { isSameDay } from "date-fns";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { useAppSelector } from "../../redux/hooks";

interface DayItemProps {
    tripId: number;
    date: Date;
    dayNumber: number;
}

export default function Day(props: DayItemProps) {

    const eventList = useEventItem(props.tripId)
    const currentDateList = eventList.filter((event) => {
        return isSameDay(new Date(event.date), props.date)
    })

    function handleDragEnd(event: DragEndEvent) {
        console.log('drag end called')
    }

    return (
        <>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.dayContainer}>
                    <div className={styles.dayHeader}>
                        <div>Day {props.dayNumber}</div>
                        <div>{(props.date).toDateString()}</div>
                    </div>
                    <div className={styles.eventContainer}>
                        <SortableContext items={currentDateList} strategy={verticalListSortingStrategy}>
                            {
                                currentDateList.map((event) => (
                                    <Event key={event.id} id={event.id} eventName={event.name} location={event.location} date={event.date} />
                                ))
                            }
                        </SortableContext>
                    </div>
                </div>
            </DndContext>
        </>
    )
}