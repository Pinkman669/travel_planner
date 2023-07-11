import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import styles from '../../css/Schedule.module.css'
import Day from "./Day";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventItem, updateEventDate, updateEventOrder, useEventItem } from "./EventAPI";
import { isSameDay } from "date-fns";
import { notify } from "../utils/utils";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { addDays } from 'date-fns'
import Event from "./Event";
import { duration } from "@mui/material";

interface ScheduleProps {
    tripName: string;
    userName: string;
    arrOfTripDate: Date[];
    tripId: number;
}

interface OverLayState {
    id: number;
    location: string;
    name: string;
    date: Date;
}

interface DropAnimation {
    duration: number;
    easing: string;
  }

export default function Schedule(props: ScheduleProps) {
    const queryClient = useQueryClient()
    const eventList = useEventItem(props.tripId)
    const [overLayActiveState, setOverLayActiveState] = useState<OverLayState | null>(null)
    const [draggingOver, setDraggingOver] = useState<boolean>(false)
    const arrOfTripDate = props.arrOfTripDate
    const tripId = props.tripId
    const sortedEventMap = new Map()
    arrOfTripDate.forEach((date, index) => {
        const currentDateList = eventList.filter((event) => isSameDay(new Date(event.date), date))
        sortedEventMap.set(`day${index + 1}`, currentDateList)
    })
    const mapToObject = Object.fromEntries(sortedEventMap)

    const sensors = useSensors(
        useSensor(TouchSensor),
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const findContainer = (id: string | number) => {

        if (id in mapToObject) { // If Day container is empty, overId will be the droppable table's id
            return id
        }
        const result = Object.keys(mapToObject).find((key) => {
            return mapToObject[key].find((event: EventItem) => {
                if (event.id === Number(id)) {
                    return true
                }
            })
        });
        return result
    }

    function handleDragStart(event: DragStartEvent) {
        const activeContainer = findContainer(event.active.id)
        const eventInfo: EventItem = mapToObject[activeContainer as string].find((e: EventItem) => e.id === event.active.id)
        setOverLayActiveState({
            id: Number(event.active.id),
            location: eventInfo.location,
            name: eventInfo.name,
            date: eventInfo.date
        })

    }

    async function handleDragEnd(event: DragEndEvent) {
        if (draggingOver){
            return
        }
        const { active, over } = event
        if (active.id === over?.id) {
            return
        }
        const activeOrder = (active.data.current?.sortable.index) + 1
        const overOrder = (over?.data.current?.sortable.index) + 1
        const activeId = active.id
        const overId = over?.id
        // console.log(overId, overOrder)
        if (!activeId || !overId || !overOrder || !activeOrder) {
            return
        }
        const activeContainer = findContainer(activeId + '')
        const overContainer = findContainer(overId + '')
        if (activeContainer === overContainer) {
            onUpdateEventOrder.mutate({
                activeEventId: Number(activeId),
                overEventId: Number(overId),
                activeOrder: activeOrder,
                overOrder: overOrder
            })
        }
        setOverLayActiveState(null)
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
        // setDraggingOver(true)
        const { active, over } = event
        const activeId = active.id
        const overId = over?.id
        if (activeId === overId){
            return
        }
        const activeContainer = findContainer(activeId + '')
        const overContainer = findContainer(overId + '')
        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }
        const indexOfOverContainer = Object.keys(mapToObject).indexOf(overContainer as string)
        const newDay = indexOfOverContainer + 1
        onUpdateEventDate.mutate({
            eventId: Number(activeId),
            newDate: addDays((arrOfTripDate[indexOfOverContainer]), 1),
            newDay: newDay,
            tripId: tripId
        })
        setDraggingOver(false)
    }

    const onUpdateEventDate = useMutation(
        async (data: { eventId: number, newDate: Date, newDay: number, tripId: number }) => {
            return await updateEventDate(data.eventId, data.newDate, data.newDay, data.tripId)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['eventItems'])
            },
            onError: () => {
                notify(false, 'Event date update failed')
            }
        }
    )

    return (
        <>
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                sensors={sensors}
            >
                <div id={styles.scheduleContainer}>
                    <div id={styles.ScheduleHeader}>
                        <h3 id={styles.tripTitle}>{props.tripName}</h3>
                        <div>{props.userName}</div>
                    </div>
                    <div id={styles.ScheduleLine}></div>
                    <div id={styles.allDaysContainer}>
                        {arrOfTripDate.map((date, index) => {
                            return <Day container={`day${index + 1}`} eventList={mapToObject[`day${index + 1}`]} key={index + date.toString()} dayNumber={index + 1} date={date} tripId={props.tripId} />
                        })}
                    </div>
                </div>
                <DragOverlay dropAnimation={{
                    duration: 500,
                    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
                }}>
                    {
                        overLayActiveState ? (
                            <Event id={overLayActiveState.id}
                                location={overLayActiveState.location}
                                eventName={overLayActiveState.name}
                                date={overLayActiveState.date} />
                        ) : null
                    }
                </DragOverlay>
            </ DndContext>
        </>
    )
}