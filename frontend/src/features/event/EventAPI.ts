import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';
import { update_event_item } from './eventSlice';


interface EventItem{
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
    order: number;
    day: number;
}

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