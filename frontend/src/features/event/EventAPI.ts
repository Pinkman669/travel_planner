import { differenceInDays } from 'date-fns';
import { LocationInfo } from './NewEventModal';
import { getDetails } from "use-places-autocomplete";
import { EventItem } from '../utils/types'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../redux/hooks';
import { FavouriteDetail } from './FavouriteEvent';


export interface LocationDetail {
    name?: string,
    formatted_address?: string,
    formatted_phone_number?: string,
    opening_hours?: string[],
    website?: string,
    place_id?: string
}

export interface favouriteLocation {
    name: string,
    address: string,
    phone: string,
    business_hour: string[],
    website: string,
    place_id?: string
}


export type NewEventItem = Omit<EventItem, "id" | "day" | "trip_id">

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
export async function addNewEvent(eventList: NewEventItem, placeId: string, startDay: Date, endDay: Date,tripId: string, locationInfo: LocationInfo) {


    const eventDayString = eventList.date.toString()
    const eventDay = new Date(eventDayString)
    const startDayString = startDay.toString().split("T")[0]
    const startDayDate = new Date(startDayString)
    const differenceInDay = differenceInDays(eventDay, startDayDate)
    const day = differenceInDay

    if (eventDay < startDayDate || eventDay > new Date(endDay)){ // Reject any date is out of bound
        throw new Error('Date out of bound')
    }


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
    if (res.status !== 200){
        throw new Error()
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

export async function removeEvent(eventId: number){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/removeEvent`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            eventId
        })
    })

    if (res.status !== 200){
        throw new Error()
    }
}

export function useFavouriteEvent(tripId:string){
    const {isLoading, error, data, isFetching} = useQuery({
        queryKey: ["eventItems"],
        queryFn: async ()=> {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/getFavouriteEvent/${tripId}`,{
                method: 'GET',
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await res.json()
            return result.result as [FavouriteDetail]
        }
    })

    if(isLoading || isFetching || error || !data){
        return []
    }

    return data
}