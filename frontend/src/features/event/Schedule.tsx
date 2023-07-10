import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter } from '@dnd-kit/core';
import styles from '../../css/Schedule.module.css'
import Day from "./Day";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventItem, updateEventOrder, useEventItem } from "./EventAPI";
import { isSameDay } from "date-fns";
import { notify } from "../utils/utils";

interface ScheduleProps {
    tripName: string;
    userName: string;
    arrOfTripDate: Date[];
    tripId: number;
}

export default function Schedule(props: ScheduleProps) {
    const queryClient = useQueryClient()
    const arrOfTripDate = props.arrOfTripDate
    const eventList = useEventItem(props.tripId)
    const sortedEventMap = new Map()
    arrOfTripDate.forEach((date, index) =>{
        const currentDateList = eventList.filter((event) => isSameDay(new Date(event.date), date))
        sortedEventMap.set(index+1, currentDateList)
    })
    const mapToObject = Object.fromEntries(sortedEventMap)
    const [items, setItems] = useState(mapToObject);
    const findContainer = (id: number) => {
        return Object.keys(items).find((key, index) => {
            return items[key].find((event: EventItem) => {
                return event.id === id
            })
        });
    }

    const onClickSet = () =>{
        setItems(mapToObject)
        console.log(items)
    }

    const handleDragStart = (event: DragStartEvent) => {

    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active.id === over?.id) {
            return
        }
        const activeOrder = (active.data.current?.sortable.index) + 1
        const overOrder = (over?.data.current?.sortable.index) + 1
        const activeId = active.id
        const overId = over?.id
        if (!activeId || !overId){
            return
        }
        const activeContainer = findContainer(Number(activeId))
        const overContainer = findContainer(Number(overId))
        if (activeContainer === overContainer){
            onUpdateEventOrder.mutate({
                activeEventId: Number(activeId),
                overEventId: Number(overId),
                activeOrder: activeOrder,
                overOrder: overOrder
            })
        }
    }
    const onUpdateEventOrder = useMutation(
        async (data: { activeEventId: number, overEventId: number, activeOrder: number, overOrder: number }) => {
            return await updateEventOrder(data.activeEventId, data.overEventId, data.activeOrder, data.overOrder)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['eventItems'])
            },
            onError: () => {
                notify(false, 'Event rearrange failed')
            }
        }
    )

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over,  } = event
        const activeId = Number(active.id)
        const overId = Number(over?.id)
        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId)
        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }
        console.log(activeContainer,overContainer)
        
    }

    return (
        <>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
            >   
                <button onClick={onClickSet}>ready</button>
                <div id={styles.scheduleContainer}>
                    <div id={styles.ScheduleHeader}>
                        <h3 id={styles.tripTitle}>{props.tripName}</h3>
                        <div>{props.userName}</div>
                    </div>
                    <div id={styles.ScheduleLine}></div>
                    <div id={styles.allDaysContainer}>
                        {arrOfTripDate.map((date, index) => {
                            return <Day eventList={mapToObject[index+1]} key={index + date.toString()} dayNumber={index + 1} date={date} tripId={props.tripId} />
                        })}
                    </div>
                </div>
            </ DndContext>
        </>
    )
}