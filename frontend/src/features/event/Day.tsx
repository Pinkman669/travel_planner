import React, { useEffect, useState } from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'
import { SortableContext } from "@dnd-kit/sortable";
import { EventItem } from '../utils/types'
import { useDroppable } from "@dnd-kit/core";
import DaySelector from "./DaySelector";
import { useAppSelector } from "../../redux/hooks";
import { format } from "date-fns";

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
    // rename
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
    }, [selectedDay, props.container])

    function onClickDayEffect() {
        setChangeStyle(styles.daySelectedEffect)
    }


    return (
        <>
            <div className={`${styles.dayContainer} ${changeStyle}`}>
                <div className={styles.dayHeader}>
                    <div>
                        <div className={styles.dayTitle}>
                            <div className={styles.tripDayNumber}>Day {props.dayNumber}</div>
                        </div>
                        <div className={styles.tripDate}>{format(new Date(props.date), 'E, d-MMM-yy')}</div>
                    </div>
                    <div>
                        <DaySelector onClickDayEffect={onClickDayEffect} dayNumber={props.container} />
                    </div>
                </div>
                <div className={styles.eventContainer}>
                    <SortableContext id={props.container} items={eventList}>
                        <div ref={setNodeRef}>
                            {
                                eventList.map((event) => (
                                    <Event eventItem={event} key={event.id} id={event.id} eventName={event.name} location={event.location} date={event.date} />
                                ))
                            }
                        </div>
                    </SortableContext>
                </div>
            </div>
        </>
    )
}