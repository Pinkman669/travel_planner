import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import styles from '../../css/Schedule.module.css'
import Day from "./Day";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventItem, updateDayEventOrder, updateEventOrder, useEventItem } from "./EventAPI";
import { notify } from "../utils/utils";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Event from "./Event";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { new_update_event_order, new_update_event_order_date } from "./newEventSlice"

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

export default function Schedule(props: ScheduleProps) {
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    useEventItem(props.tripId)
    const [overLayActiveState, setOverLayActiveState] = useState<OverLayState | null>(null)
    const arrOfTripDate = (useAppSelector(state => state.trip.tripItems.find((trip) => trip.id === props.tripId)))?.DatesOfTrip
    const mapToObject = JSON.parse(localStorage.getItem('newEventItems') as string)
    // const testingMap = useAppSelector(state => state.new_event.new_eventItems) 

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

    async function handleDragEnd(event: DragEndEvent) { // In charge of swapping orders
        const { active, over } = event
        if (active.id === over?.id) {
            return
        }
        const activeId = active.id
        const overId = over?.id
        if (!activeId || !overId) {
            return
        }
        const activeContainer = findContainer(activeId + '')
        const overContainer = findContainer(overId + '')
        if (activeContainer !== overContainer) {
            return
        }
        const eventList = mapToObject[activeContainer as string]
        const activeInfo = eventList.find((event: EventItem) => event.id === activeId)
        const overInfo = eventList.find((event: EventItem) => event.id === overId)
        const activeIndex = eventList.indexOf(activeInfo) + 1
        const overIndex = eventList.indexOf(overInfo) + 1
        if (!activeIndex || !overIndex) {
            return
        }
        const newEventList = eventList.map((event: EventItem) => {
            if (event.id === activeId) {
                event.item_order = overIndex
            } else if (event.id === overId) {
                event.item_order = activeIndex
            }
            return event
        })
        dispatch(new_update_event_order({
            container: activeContainer as string,
            eventlist: newEventList
        }))

        console.log(JSON.parse(localStorage.getItem('newEventItems') as string))

        onUpdateEventOrder.mutate({
            activeEventId: Number(activeId),
            overEventId: Number(overId),
            activeOrder: activeIndex,
            overOrder: overIndex
        })
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

    const handleDragOver = (event: DragOverEvent) => { // In charge of moving to different day column
        const { active, over } = event
        const activeId = active.id
        const overId = over?.id
        if (activeId === overId) {
            return
        }
        const activeContainer = findContainer(activeId + '')
        const overContainer = findContainer(overId + '')
        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }
        const indexOfOverContainer = Object.keys(mapToObject).indexOf(overContainer as string)
        const newDay = indexOfOverContainer + 1
        const activeEventList = mapToObject[activeContainer as string]
        const overEventList = mapToObject[overContainer as string]
        const activeInfo = activeEventList.find((event: EventItem) => event.id === activeId)
        const overInfo = overEventList.find((event: EventItem) => event.id === overId)
        const overIndex = overEventList.indexOf(overInfo) + 1

        let newIndex: number
        if (overId as string in mapToObject) { // Moved to empty Day
            newIndex = 1
        } else {
            const isLastItem = over && overIndex === overEventList.length
            const modifier = isLastItem ? 1 : 0
            newIndex = overIndex >= 0 ? overIndex + modifier : overEventList.length + 1
        }

        const newDate = arrOfTripDate![indexOfOverContainer]
        const newActiveEventList = activeEventList.filter((event: any) => event.id !== Number(activeId))
        const newOverEventList = overEventList.slice()
        for (let i in newOverEventList) {
            if (overEventList[i].item_order >= newIndex) {
                overEventList[i].item_order++
            }
        }
        activeInfo.day = newDay
        activeInfo.date = newDate
        activeInfo.item_order = newIndex
        newOverEventList.push(activeInfo)
        for (let i in newActiveEventList) {
            if (newActiveEventList[i].item_order >= newIndex) {
                newActiveEventList[i].item_order--
            }
        }
        dispatch(new_update_event_order_date({
            activeContainer: activeContainer as string,
            overContainer: overContainer as string,
            activeEventList: newActiveEventList,
            overEventList: newOverEventList
        }))
        console.log(JSON.parse(localStorage.getItem('newEventItems')!))

        onUpdateDayEvent.mutate({
            activeEvenList: newActiveEventList,
            overEventList: newOverEventList
        })

    }

    const onUpdateDayEvent = useMutation(
        async (data: { activeEvenList: any, overEventList: any }) => {
            return await updateDayEventOrder(data.activeEvenList, data.overEventList)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['eventItems'])
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
                        {arrOfTripDate!.map((date, index) => {
                            const evenList = mapToObject[`day${index + 1}`] ? mapToObject[`day${index + 1}`] : []
                            return <Day container={`day${index + 1}`} eventList={evenList} key={index + date.toString()} dayNumber={index + 1} date={date} tripId={props.tripId} />
                        })}
                    </div>
                </div>
                <DragOverlay dropAnimation={{
                    duration: 300,
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