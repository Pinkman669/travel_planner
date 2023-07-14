import { Knex } from 'knex'

export class EventService {
    constructor(private knex: Knex) { }

    async getEvents(tripId: number) {
        const result = await this.knex
            .select('*')
            .from('events')
            .where('trip_id', tripId)
            .andWhere('active', true)
            .orderBy('item_order', 'asc')
        return result
    }

    async updateEventOrder(eventId: number, newOrder: number) {
        await this.knex
            .update({
                'item_order': newOrder
            })
            .from('events')
            .where('id', eventId)
            .returning(['trip_id', 'day'])
    }

    async updateEventDate(eventId: number, newDate: Date, newDay: number, item_order: number) {
        await this.knex
            .update({
                'date': newDate,
                'day': newDay,
                'item_order': item_order
            })
            .from('events')
            .where('id', eventId)
    }

    async getEventByDay(tripId: number, day: number) {
        const result = await this.knex
            .select('*')
            .from('events')
            .where('trip_id', tripId)
            .andWhere('active', true)
            .andWhere('day', day)
        return result
    }


    async addNewEvent(data: {
        name: string, date: Date, time?: TimeRanges, location: string, business_hours?: string[],
        phone?: string, website?: string, budget?: number, expense?: number, category: string
    }, place_id: string, day: Number, trip_id: string) {

        const res = await this.knex
            .first('item_order')
            .where('trip_id', trip_id)
            .andWhere('day', day)
            .orderBy('item_order','desc')
            .from("events")
        console.log("res:",res)

        await this.knex
            .insert({
                'name': data.name,
                'date': data.date,
                'time': data.time,
                'location': data.location,
                'business_hours': data.business_hours,
                'phone': data.phone,
                'website': data.website,
                'budget': data.budget,
                'expense': data.expense,
                'category': data.category,
                'item_order': res.item_order +1,
                'day': day,
                'active': true,
                'place_id': place_id
            })
            .into('events')

    }
}