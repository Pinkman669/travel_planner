import { useQuery } from '@tanstack/react-query'


interface EventItem{
    id: number;
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
    const {isLoading, error, data, isFetching } = useQuery({
        queryKey: ['eventItems'],
        queryFn : async() =>{
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/getEvent/${tripId}`,{
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

    return data
}