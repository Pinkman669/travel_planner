import { Knex } from 'knex'

export class TripService{
    constructor(private knex: Knex){}

    async addTrip(tripName: string, location: string, startDate: Date, endDate: Date){
        this.knex.insert({
            'name': tripName,
            'location': location,
            'start_date': startDate,
            'end_date': endDate
        })
        .into('trips')
    }
}