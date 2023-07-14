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

    async addNewEvent(data: {name: string, date: Date, time?: TimeRanges, location: string, business_hours?: string[],
        phone?: string, website?: string, budget?: number, expense?: number, category: string,
       day: number, place_id: string}) {

        await this.knex.insert({
            'name': data.name,
            'date': data.date,
            'time': data.time,
            'location': data.location,
            'business_hour': data.business_hours,
            'phone': data.phone,
            'website':data.website,
            'budget':data.budget,
            'expense':data.expense,
            'category':data.category,
            'order':1,
            'day':data.day,
            'active':true,
            'place_id':data.place_id
        })
            .into('events')
    }
}