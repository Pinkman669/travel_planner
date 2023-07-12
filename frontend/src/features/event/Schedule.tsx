import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import styles from '../../css/Schedule.module.css'
import Day from "./Day";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventItem, updateDayEventOrder, updateEventDate, updateEventOrder, useEventItem } from "./EventAPI";
import { isSameDay } from "date-fns";
import { notify } from "../utils/utils";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { addDays } from 'date-fns'
import Event from "./Event";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { update_event_item, update_event_order } from "./eventSlice";

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
    const eventList = useEventItem(props.tripId)
    const localEventList = useAppSelector(state => state.event.eventItems)
    const [overLayActiveState, setOverLayActiveState] = useState<OverLayState | null>(null)
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
        const activeInfo = mapToObject[activeContainer as string].find((event: EventItem) => event.id === activeId)
        const overInfo = mapToObject[overContainer as string].find((event: EventItem) => event.id === overId)
        const activeIndex = mapToObject[activeContainer as string].indexOf(activeInfo) + 1
        const overIndex = mapToObject[overContainer as string].indexOf(overInfo) + 1
        if (!activeIndex || !overIndex) {
            return
        }
        if (activeContainer === overContainer) {
            onUpdateEventOrder.mutate({
                activeEventId: Number(activeId),
                overEventId: Number(overId),
                activeOrder: activeIndex,
                overOrder: overIndex
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
        // const activeIndex = activeEventList.indexOf(activeInfo) + 1
        const overIndex = overEventList.indexOf(overInfo) + 1

        let newIndex: number
        if (overId as string in mapToObject) { // Moved to empty Day
            newIndex = 1
        } else {
            const isLastItem = over && overIndex === overEventList.length
            const modifier = isLastItem ? 1 : 0
            newIndex = overIndex >= 0 ? overIndex + modifier : overEventList.length + 1
        }
        const newDate = arrOfTripDate[indexOfOverContainer].toString()
        dispatch(update_event_order({day: newDay, date: (newDate), item_order: newIndex, id: Number(activeId)}))
        for (let i in overEventList){
            if (overEventList[i].item_order >= newIndex){
                console.log('im hit ' + overEventList[i].name)
                const newItemOrder = overEventList[i].item_order + 1
                dispatch(update_event_order({day: newDay, date: (newDate), item_order: newItemOrder, id: overEventList[i].id}))
            }
        }
        const newActiveEventList = activeEventList.filter((event:any) => event.id !== Number(activeId))
        for (let i in newActiveEventList){
            if (newActiveEventList[i].item_order >= newIndex){
                const newItemOrder = newActiveEventList[i].item_order - 1
                const origDay = new Date(newActiveEventList[i].date).toString()
                dispatch(update_event_order({day: newActiveEventList[i].day, date: (origDay), item_order: newItemOrder, id: newActiveEventList[i].id}))
            }
        }
        onUpdateDayEvent.mutate({
            evenList: JSON.parse(localStorage.getItem('eventItems')!)
        })
        
    }

    function handleTry(){
        dispatch(update_event_order({day: 5, date: new Date().toString(), item_order: 55, id: 1}))
    }

    const onUpdateDayEvent = useMutation(
        async(data: { evenList: any }) =>{
            return await updateDayEventOrder(data.evenList)
        },
        {
            onSuccess: () =>{
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
                <button onClick={handleTry}>click</button>
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
                    duration: 0,
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