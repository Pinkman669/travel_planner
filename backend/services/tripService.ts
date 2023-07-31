import { Knex } from 'knex'
import { TripItem } from '../util/type'
import { calculateNumberOfDays } from '../util/utilFn'

export class TripService {
    constructor(private knex: Knex) { }

    async addTrip(tripName: string, location: string, startDate: Date, endDate: Date, userId: number) {
        await this.knex.insert({
            'name': tripName,
            'location': location,
            'start_date': startDate,
            'end_date': endDate,
            'user_id': userId,
            'active': true
        })
            .into('trips')
    }

    async getTrip(userId: number) {
        const result = await this.knex
            .select('*')
            .from('trips')
            .where('user_id', userId)
            .andWhere('active', true)

        if (result.length) {
            for (let tripItem of result){
                const DatesOfTrip = calculateNumberOfDays(tripItem)
                tripItem.DatesOfTrip = DatesOfTrip
            }
        }
        return result as TripItem[]
    }

    async getSingelTrip(tripId: number) {
        const result = (await this.knex
            .select('*')
            .from('trips')
            .where('id', tripId)
            .andWhere('active', true))[0]

        return result
    }

    async removeTrip(tripId: number) {
        await this.knex.update({
            'active': false
        })
            .from('trips')
            .where('id', tripId)
    }
}