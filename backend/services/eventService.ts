import {Knex} from 'knex'

export class EventService{
    constructor(private knex: Knex){}

    async getEvents(tripId: number){
        const result = await this.knex
            .select('*')
            .from('events')
            .where('trip_id', tripId)
        return result
    }
}