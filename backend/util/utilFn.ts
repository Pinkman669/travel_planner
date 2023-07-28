import { addDays, differenceInDays } from "date-fns"
import { TripItem } from "./type"

export function calculateNumberOfDays(tripInfo: TripItem) {
    const numberOfDays = differenceInDays(new Date(tripInfo.end_date), new Date(tripInfo.start_date)) + 1
    const startDate = new Date(tripInfo.start_date)
    const DatesOfTrip = []
    for (let i = 0; i < numberOfDays; i++) {
        DatesOfTrip.push(addDays(startDate, i).toDateString())
    }
    return DatesOfTrip
}