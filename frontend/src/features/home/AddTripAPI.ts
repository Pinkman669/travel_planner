import { addDays } from 'date-fns'

export async function addTrip(tripName: string, numberOfDays: number, location: string, startDate: Date) {
    const endDate: Date = addDays(startDate, numberOfDays)
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/addTrip`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            tripName, location, startDate, endDate
        })
    })

    const result = await res.json()
    if (res.status === 200){
        console.log(result)
        return true
    } else{
        return false
    }
}