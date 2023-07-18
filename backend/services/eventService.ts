import { Knex } from 'knex';


export interface LocationDetail {
    name?:string ,
    formatted_address?: string,
    formatted_phone_number?: string ,
    opening_hours?: string[],
    website?: string,
    place_id?: string
  }

  export interface LocationInfo{
    name: string;
    address: string;
    businessHours: string[] | null;
    phone: string | null;
    website: string | null;
  }

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
            .andWhere('active', true)
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
            .andWhere('active', true)
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
    }, place_id: string, day: Number, trip_id: string, locationInfo: LocationInfo) {

        const res = await this.knex
            .first('item_order')
            .where('trip_id', trip_id)
            .andWhere('day', day)
            .andWhere('active', true)
            .orderBy('item_order','desc')
            .from("events")
        
       const order = res?.item_order ? res.item_order +1 :1
        await this.knex
            .insert({
                'name': locationInfo.name,
                'date': data.date,
                'time': data.time,
                'location': locationInfo.address,
                'business_hours': locationInfo.businessHours,
                'phone': locationInfo.phone,
                'website': locationInfo.website,
                'budget': data.budget,
                'expense': data.expense,
                'category': data.category,
                'item_order':order,
                'day': day,
                'active': true,
                'place_id': place_id,
                'trip_id': trip_id
            })
            .into('events')

    }
    async addFavouriteEvent(data: LocationDetail, tripId: string){

        const userId =  await this.knex
        .select('user_id')
        .where('id', tripId)
        .from("trips")

        await this.knex.insert({
            "name":data.name,
            "address":data.formatted_address,
            "phone":data.formatted_phone_number,
            "business_hours": data.opening_hours!.toString(),
            "website": data.website,
            "place_id": data.place_id,
            "trip_id":tripId,
            "user_id":userId[0].user_id,
            "active": true
        })
        .into('favourite_events')
    }

    async removeEvent(eventId: number){
        await this.knex
            .update({
                'active': false
            })
            .from('events')
            .where('id', eventId)
    }
    
    async getFavouriteEvent(tripId: number) {
        const result = await this.knex
            .select('*')
            .from('favourite_events')
            .where('trip_id', tripId)
            .andWhere('active', true)
            .orderBy('id', 'asc')
        
    for (let i=0; i< result.length;i++) {
        result[i].business_hours = result[i].business_hours.split()
    }
        return result
    }
}
