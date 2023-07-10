import {Knex} from 'knex'

export class EventService{
    constructor(private knex: Knex){}

    async getEvents(tripId: number){
        const result = await this.knex
            .select('*')
            .from('events')
            .where('trip_id', tripId)
            .orderBy('item_order', 'asc')
        return result
    }

    async updateEventOrder(eventId: number , newOrder: number){
        await this.knex
            .update({
                'item_order': newOrder
            })
            .from('events')
            .where('id', eventId)
    }
}