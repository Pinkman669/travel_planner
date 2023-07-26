import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import styles from '../../css/Schedule.module.css'
import Day from "./Day";
import { useMutation } from "@tanstack/react-query";
import { updateDayEventOrder, updateEventOrder } from "./EventAPI";
import { notify } from "../utils/utils";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Event from "./Event";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchEventByTrip, new_update_event_active_order_date, new_update_event_order, new_update_event_over_order_date } from "./newEventSlice"
import { EventItem } from '../utils/types'

interface ScheduleProps {
    tripName: string;
    userName: string;
    tripId: number;
    screenWidth: number;
}

interface OverLayState {
    id: number;
    location: string;
    name: string;
    date: Date;
    eventItem: EventItem
}

export default function Schedule(props: ScheduleProps) {
    const dispatch = useAppDispatch()
    // use a shorter name
    const arrOfTripDate = (useAppSelector(state => state.trip.tripItems.find((trip) => trip.id === props.tripId)))?.DatesOfTrip
    
    useEffect(() => {
        // datesOfTrip is not necessary
        dispatch(fetchEventByTrip({ tripId: props.tripId, datesOfTrip: arrOfTripDate || [] }))
    }, [dispatch, arrOfTripDate, props.tripId])
    
    const [overLayActiveState, setOverLayActiveState] = useState<OverLayState | null>(null)
    // rename: newEventItemss
    const mapToObject = useAppSelector(state => state.new_event.new_eventItems)

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 300,
                tolerance: 5
            }
        }),
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 300,
                tolerance: 5
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const findContainer = (id: string) => {
        if (id in mapToObject) { // If Day container is empty, overId will be the droppable table's id
            return id
        }
        const result = Object.keys(mapToObject).find((key) => {
            return mapToObject[key].find((event) => {
                if (event.id === Number(id)) {
                    return true
                } else{
                    return false
                }
            })
        });
        return result
    }

    function handleDragStart(event: DragStartEvent) {
        const activeContainer = findContainer(event.active.id.toString())
        const eventInfo = mapToObject[activeContainer!].find((e) => e.id === event.active.id)
        setOverLayActiveState({
            eventItem: eventInfo as EventItem,
            id: Number(event.active.id),
            location: eventInfo?.location + '',
            name: eventInfo?.name + '',
            date: new Date()
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
        const activeInfo = eventList.find((event) => event.id === activeId)
        const overInfo = eventList.find((event) => event.id === overId)
        const activeIndex = eventList.indexOf(activeInfo as EventItem) + 1
        const overIndex = eventList.indexOf(overInfo as EventItem) + 1

        if (!activeIndex || !overIndex) {
            return
        }
        
        dispatch(new_update_event_order({
            container: activeContainer as string,
            activeId: Number(activeId),
            activeIndex: activeIndex,
            overId: Number(overId),
            overIndex: overIndex
        }))
        onUpdateEventOrder.mutate({
            activeEventId: Number(activeId),
            activeOrder: activeIndex,
            overOrder: overIndex,
            eventList: eventList
        })
    
        setOverLayActiveState(null)
    }
    const onUpdateEventOrder = useMutation(
        async (data: { activeEventId: number,activeOrder: number, overOrder: number, eventList: EventItem[] }) => {
            return await updateEventOrder(data.activeEventId, data.activeOrder, data.overOrder, data.eventList)
        },
        {
            onError: () => {
                notify(false, 'Event rearrange failed')
            },
            onSettled: () => dispatch(fetchEventByTrip({ tripId: props.tripId, datesOfTrip: arrOfTripDate || [] }))
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
        const activeInfo = activeEventList.find((event) => event.id === activeId)
        const overInfo = overEventList.find((event) => event.id === overId)
        const activeIndex = activeEventList.indexOf(activeInfo as EventItem) + 1
        const overIndex = overEventList.indexOf(overInfo as EventItem) + 1

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
        newOverEventList.push(activeInfo as EventItem)

        dispatch(new_update_event_active_order_date({
            activeContainer: activeContainer as string,
            overContainer: overContainer as string,
            overEventList: newOverEventList,
            activeInfo: activeInfo as EventItem,
            activeIndex: activeIndex,
        }))
        dispatch(new_update_event_over_order_date({
            overContainer: overContainer as string,
            activeInfo: activeInfo as EventItem,
            newDate: newDate,
            newDay: newDay,
            newIndex: newIndex
        }))

        onUpdateDayEvent.mutate({
            activeEvenList: newActiveEventList,
            overEventList: newOverEventList,
            newDate: newDate,
            newIndex: newIndex,
            newDay: newDay,
            activeIndex: activeIndex,
            activeEventId: activeInfo!.id
        })

    }

    const onUpdateDayEvent = useMutation(
        async (data: {
            activeEvenList: any, overEventList: any, newIndex: number, newDate: Date, newDay: number, activeEventId: number, activeIndex: number
        }) => {
            return await updateDayEventOrder(
                data.activeEvenList, data.overEventList, data.newDate, data.newDay, data.newIndex, data.activeEventId, data.activeIndex
            )
        },
        {
            onSettled: () => dispatch(fetchEventByTrip({ tripId: props.tripId, datesOfTrip: arrOfTripDate || [] }))
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
                            // don't need `day` in key
                            const evenList = mapToObject[`day${index + 1}`] ? mapToObject[`day${index + 1}`] : []
                            return <Day container={`day${index + 1}`} eventList={evenList as EventItem[]} key={index + date.toString()} dayNumber={index + 1} date={date} tripId={props.tripId} />
                        })}
                    </div>
                </div>
                <DragOverlay dropAnimation={{
                    duration: 300,
                    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
                }}>
                    {
                        overLayActiveState ? (
                            <Event
                                eventItem={overLayActiveState.eventItem} 
                                id={overLayActiveState.id}
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