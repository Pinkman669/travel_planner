import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';
import { update_event_item } from './eventSlice';
import { differenceInDays } from 'date-fns';


export interface EventItem{
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
    place_id: string
}

export type NewEventItem = Omit<EventItem,"id"|"day"|"trip_id">

export function useEventItem(tripId: number){
    const dispatch = useDispatch()
    const {isLoading, error, data, isFetching, status } = useQuery({
        queryKey: ['eventItems'],
        queryFn : async() =>{
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/getEvents/${tripId}`,{
                headers : {
                    "Authorization":`Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await res.json()
            return result.result as EventItem[]
        }
    })

    if (isLoading || isFetching || error || !data){
        return []
    }
    if (status === 'success'){
        dispatch(update_event_item(data))
    }
    return data
}

export async function updateEventOrder(activeEventId: number, overEventId: number, activeOrder: number, overOrder: number){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateEventOrder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            activeEventId , overEventId, activeOrder, overOrder
        })
    })

    if (res.status === 200){
        return true
    } else{
        return false
    }
}

export async function updateEventDate(activeEventId: number, newDate: Date ,newDay:number, tripId: number){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateEventDate`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            activeEventId , newDate, newDay, tripId
        })
    })
    
    if (res.status === 200){
        return true
    } else{
        return false
    }
}

export async function updateDayEventOrder(eventList: EventItem[]){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/updateDayEventOrder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            eventList
        })
    })
}

export async function addNewEvent(eventList: NewEventItem, placeId:string, startDay:Date){

    const day= differenceInDays(eventList.date,startDay)

    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/addNewEvent`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            eventList, placeId, day
        })
})

    if (res.status === 200){
        return true
    } else{
        return false
    }
}