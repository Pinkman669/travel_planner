import { differenceInDays } from 'date-fns';
import { LocationInfo } from './NewEventModal';
import { getDetails } from "use-places-autocomplete";
import { EventItem } from '../utils/types'
import { useQuery } from '@tanstack/react-query'
// import { new_update_event_item } from './newEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { isSameDay } from 'date-fns';


export interface LocationDetail {
    name?: string,
    formatted_address?: string,
    formatted_phone_number?: string,
    opening_hours?: string[],
    website?: string,
    place_id?: string
}


export type NewEventItem = Omit<EventItem, "id" | "day" | "trip_id">

// export function useEventItem(tripId: number) {
//     const dispatch = useAppDispatch()
//     const datesOfTrip = (useAppSelector(state => state.trip.tripItems.find((trip) => trip.id === tripId)))?.DatesOfTrip
//     const { isLoading, error, data, isFetching, status } = useQuery({
//         queryKey: ['eventItems'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/getEvents/${tripId}`, {
//                 headers: {
//                     "Authorization": `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             const result = await res.json()
//             return result.result as EventItem[]
//         }
//     })

//     if (isLoading || isFetching || error || !data) {
//         return []
//     }
//     if (status === 'success') {
//     }
//     dispatch(update_event_item(data))
//     const sortedEventMap = new Map()
//     datesOfTrip!.forEach((date, index) => {
//         const currentDateList = data.filter((event) => isSameDay(new Date(event.date), new Date(date)))
//         sortedEventMap.set(`day${index + 1}`, currentDateList)
//     })
//     const mapToObject = Object.fromEntries(sortedEventMap)
//     dispatch(new_update_event_item(mapToObject))
//     return data
// }

export async function updateEventOrder(activeEventId: number, activeOrder: number, overOrder: number, eventList: EventItem[]) {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateEventOrder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            activeEventId, activeOrder, overOrder, eventList
        })
    })

    if (res.status === 200) {
        return true
    } else {
        return false
    }
}
export async function updateDayEventOrder(
    activeEventList: EventItem[],
    overEventList: EventItem[],
    newDate: Date, newDay: number,
    newIndex: number,
    activeEventId: number,
    activeIndex: number
) {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateDayEventOrder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            activeEventList, overEventList, newDate, newDay, newIndex, activeEventId, activeIndex
        })
    })

    if (res.status === 200) {
        return true
    } else {
        return false
    }
}
export async function addNewEvent(eventList: NewEventItem, placeId: string, startDay: Date, tripId: string, locationInfo: LocationInfo) {

    console.log(addNewEvent!!!!)
    const eventDayString = eventList.date.toString()
    console.log(eventDayString)
    const eventDay = new Date(eventDayString)
    const startDayString = startDay.toString().split("T")[0]
    console.log(startDayString)
    const startDayDate = new Date(startDayString)
    console.log("eventDay:" + eventDay + " start :" + startDayDate)

    const differenceInDay = differenceInDays(eventDay, startDayDate)
    console.log(differenceInDay)
    const day = differenceInDay + 1


    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/addNewEvent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            eventList, placeId: placeId, day: day, tripId: tripId, locationInfo: locationInfo
        })
    })
    if (res.status === 200) {
        return true
    } else {
        return false
    }
}


export default function usePlaceInfo() {
    const placeId = useAppSelector((state) => state.place.placeId!);

    const placeInfo = {
        placeId: placeId,
        fields: [
            "name",
            "formatted_address",
            "formatted_phone_number",
            "opening_hours",
            "website",
            "place_id"
        ]
    }
    const { isLoading, error, data, isFetching } = useQuery(
        ["placeDetail", placeId],
        async () => {
            const detail = (await getDetails(
                placeInfo
            )) as google.maps.places.PlaceResult;
            return detail
        }, {
        refetchOnWindowFocus: false,
    }
    );

    if (isLoading || error || !data || isFetching) {
        return null;
    }
    return data
}

export async function addFavouriteLocation(data: LocationDetail, tripId: string) {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/addFavouriteLocation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            data, tripId
        })
    })

    if (res.status === 200) {
        return true
    } else {
        return false
    }
}