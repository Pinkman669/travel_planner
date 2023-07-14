import React, { useEffect, useState } from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'
import { SortableContext } from "@dnd-kit/sortable";
import { EventItem } from './EventAPI'
import { useDroppable } from "@dnd-kit/core";
import DaySelector from "./DaySelector";
import { useAppSelector } from "../../redux/hooks";

interface DayItemProps {
    tripId: number;
    date: string | Date;
    dayNumber: number;
    eventList: EventItem[]
    container: string;
}

export default function Day(props: DayItemProps) {
    const eventList = props.eventList
    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const [changeStyle, setChangeStyle] = useState<string | null>(null)
    const { setNodeRef } = useDroppable({
        id: props.container
    });

    useEffect(() =>{
        if (selectedDay === props.container){
            setChangeStyle(styles.daySelectedEffect)
        } else{
            setChangeStyle(null)
        }
    }, [selectedDay])

    function onClickDayEffect() {
        setChangeStyle(styles.daySelectedEffect)
    }


    return (
        <>
            <div className={`${styles.dayContainer} ${changeStyle}`}>
                <div className={styles.dayHeader}>
                    <div className={styles.dayTitle}>
                        <div>Day {props.dayNumber}</div>
                        <DaySelector onClickDayEffect={onClickDayEffect} dayNumber={props.container} />
                    </div>
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