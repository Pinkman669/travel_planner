import { Knex } from 'knex'

export class EventService {
    constructor(private knex: Knex) { }

    async getEvents(tripId: number) {
        const result = await this.knex
            .select('*')
            .from('events')
            .where('trip_id', tripId)
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
    }

    async updateEventDate(eventId: number, newDate: Date, newDay: number, item_order: number){
        await this.knex
            .update({
                'date': newDate,
                'day': newDay,
                'item_order': item_order
            })
            .from('events')
            .where('id', eventId)
    }

    async getEventByDay(tripId: number, day: number){
        const result = await this.knex
            .select('*')
            .from('events')
            .where('trip_id', tripId)
            .andWhere('day', day)
        return result
    }

    async addNewEvent(name: string, date: Date, time?: TimeRanges, location: string, business_hours?: string[],
        phone?: string, website?: string, budget?: number, expense?: number, category: string,
        order: number, day: number, place_id: string) {
        await this.knex.insert({
            'name': name,
            'date': date,
            'time': time,
            'location': location,
            'business_hour': business_hours,
            'phone': phone,
            'website':website,
            'budget':budget,
            'expense':expense,
            'category':category,
            'order':order,
            'day':day,
            'active':true,
            'place_id':place_id
        })
            .into('events')
    }
}