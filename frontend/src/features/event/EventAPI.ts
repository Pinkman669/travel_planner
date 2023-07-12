import { useQuery } from '@tanstack/react-query'
import { update_event_item } from './eventSlice';
import { new_update_event_item } from './newEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { isSameDay } from 'date-fns';

export interface EventItem {
    id: number;
    name: string;
    date: Date;
    time: Date;
    location: string;
    business_hours: string;
    phone: string;
    website: string;
    budget: number;
    expense: number;
    trip_id: number;
    category: string;
    item_order: number;
    day: number;
}

export function useEventItem(tripId: number) {
    const dispatch = useAppDispatch()
    const datesOfTrip = (useAppSelector(state => state.trip.tripItems.find((trip) => trip.id === tripId)))?.DatesOfTrip
    const { isLoading, error, data, isFetching, status } = useQuery({
        queryKey: ['eventItems'],
        queryFn: async () => {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/getEvents/${tripId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await res.json()
            return result.result as EventItem[]
        }
    })

    if (isLoading || isFetching || error || !data) {
        return []
    }
    if (status === 'success') {
    }
    dispatch(update_event_item(data))
    const sortedEventMap = new Map()
    datesOfTrip!.forEach((date, index) => {
        const currentDateList = data.filter((event) => isSameDay(new Date(event.date), new Date(date)))
        sortedEventMap.set(`day${index + 1}`, currentDateList)
    })
    const mapToObject = Object.fromEntries(sortedEventMap)
    dispatch(new_update_event_item(mapToObject))
    return data
}

export async function updateEventOrder(activeEventId: number, overEventId: number, activeOrder: number, overOrder: number) {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateEventOrder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            activeEventId, overEventId, activeOrder, overOrder
        })
    })

    if (res.status === 200) {
        return true
    } else {
        return false
    }
}

// export async function updateEventDate(activeEventId: number, newDate: Date, newDay: number, tripId: number) {
//     const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateEventDate`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//             activeEventId, newDate, newDay, tripId
//         })
//     })

//     if (res.status === 200) {
//         return true
//     } else {
//         return false
//     }
// }

export async function updateDayEventOrder(activeEventList: EventItem[], overEventList: EventItem[], newDate: Date, newDay: number, newIndex: number, activeEventId: number) {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateDayEventOrder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            activeEventList, overEventList, newDate, newDay, newIndex, activeEventId
        })
    })

    if (res.status === 200) {
        return true
    } else {
        return false
    }
}