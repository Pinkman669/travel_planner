import { addDays, formatISO  } from 'date-fns'


export async function addTrip(location: string, numberOfDays: number, tripName: string, startDate: Date, userId: number) {
    const startDateInDate = new Date(startDate)
    const endDate: Date = addDays(startDateInDate, numberOfDays - 1)

    const startDateStr = formatISO(startDateInDate)
    const endDateStr = formatISO(endDate)

    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/addTrip`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            tripName, location, startDateStr, endDateStr, userId
        })
    })

    if (res.status !== 200){
        throw new Error()
    }
}

export async function removeTrip(tripId: number){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/removeTrip/${tripId}`,{
        method: 'PUT',
        headers: {
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
    })

    if (res.status !== 200){
        throw new Error()
    }
}