import { Knex } from 'knex'

export class TripService{
    constructor(private knex: Knex){}

    async addTrip(tripName: string, location: string, startDate: Date, endDate: Date, userId: number){
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

    async getTrip(userId: number){
        const result = await this.knex
            .select('*')
            .from('trips')
            .where('user_id', userId)
            .andWhere('active', true)
        return result
    }

    async removeTrip(tripId: number){
        await this.knex.update({
            'active': false
        })
        .from('trips')
        .where('id', tripId)
    }
}