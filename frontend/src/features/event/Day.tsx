import React from "react";
import styles from '../../css/Day.module.css'
import Event from './Event'
import { SortableContext } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import {EventItem} from './EventAPI'

interface DayItemProps {
    tripId: number;
    date: Date;
    dayNumber: number;
    eventList: EventItem[]
}

export default function Day(props: DayItemProps) {
    const queryClient = useQueryClient()
    const eventList = props.eventList
    // const currentDateList = (eventList.filter((event) => {
    //     return isSameDay(new Date(event.date), props.date)
    // }))

    // async function handleDragEnd(event: DragEndEvent) {
    //     const { active, over } = event
    //     if (active.id === over?.id) {
    //         return
    //     }
    //     const activeOrder = (active.data.current?.sortable.index) + 1
    //     const overOrder = (over?.data.current?.sortable.index) + 1
    //     const activeEventInfo = currentDateList.find((event) => event.item_order === activeOrder)
    //     const overEventInfo = currentDateList.find((event) => event.item_order === overOrder)
    //     if (!activeEventInfo?.id || !overEventInfo?.id) {
    //         return
    //     }
    //     onUpdateEventOrder.mutate({
    //         activeEventId: activeEventInfo.id,
    //         overEventId: overEventInfo.id,
    //         activeOrder: activeOrder,
    //         overOrder: overOrder
    //     })
    // }

    // const onUpdateEventOrder = useMutation(
    //     async (data: { activeEventId: number, overEventId: number, activeOrder: number, overOrder: number }) => {
    //         return await updateEventOrder(data.activeEventId, data.overEventId, data.activeOrder, data.overOrder)
    //     },
    //     {
    //         onSuccess: () => {
    //             queryClient.invalidateQueries(['eventItems'])
    //         },
    //         onError: () => {
    //             notify(false, 'Event rearrange failed')
    //         }
    //     }
    // )

    return (
        <>
            {/* <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            > */}
                <div className={styles.dayContainer}>
                    <div className={styles.dayHeader}>
                        <div>Day {props.dayNumber}</div>
                        <div>{(props.date).toDateString()}</div>
                    </div>
                    <div className={styles.eventContainer}>
                        <SortableContext items={eventList}>
                            {
                                eventList.map((event) => (
                                    <Event key={event.id} id={event.id} eventName={event.name} location={event.location} date={event.date} />
                                ))
                            }
                        </SortableContext>
                    </div>
                </div>
            {/* </DndContext> */}
        </>
    )
}