import { useQuery } from '@tanstack/react-query'
import { addDays } from 'date-fns'

interface TripItem{
    id: number;
    start_date: Date;
    end_date: Date;
    location: string;
    name: string;
    user_id: number;
}

export function useTripItems(userId: number){
    const {isLoading, error, data, isFetching,status } = useQuery({
        queryKey: ['tripItems'],
        queryFn : async() =>{
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/getTrip/${userId}`,{
                headers : {
                    "Authorization":`Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await res.json()
            return result.result as TripItem[]
        }
    })

    if (isLoading || isFetching || error || !data){
        return []
    }
    return data
}

export async function addTrip(tripName: string, numberOfDays: number, location: string, startDate: Date, userId: number) {
    const endDate: Date = addDays(startDate, numberOfDays)
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/addTrip`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            tripName, location, startDate, endDate, userId
        })
    })

    const result = await res.json()
    if (res.status === 200){
        return true
    } else{
        return false
    }
}

export async function removeTrip(tripId: number){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/removeTrip/${tripId}`,{
        method: 'PUT',
        headers: {
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
    })

    if (res.status === 200){
        return true
    } else{
        return false
    }
}