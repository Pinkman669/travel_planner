import { addDays } from 'date-fns'


export async function addTrip(tripName: string, numberOfDays: number, location: string, startDate: Date, userId: number) {
    const endDate: Date = addDays(startDate, numberOfDays)
    console.log(`frontend add trip startdate: ${startDate}`)
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