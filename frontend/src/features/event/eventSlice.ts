import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EventItem {
    id: number;
    name: string;
    date: Date;
    time: Date;
    location: string;
    business_hours: string;
    phone: string;
    website: string;
    budget: number;
    expense: number;
    trip_id: number;
    category: string;
    order: number;
    day: number;
}

interface EventState {
    eventItems: EventItem[]
}

const initialState: EventState = localStorage.getItem('eventItems') !== null ?
    { eventItems: JSON.parse(localStorage.getItem('tripItems') as string) } :
    {
        eventItems: []
    }

export const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers : {
        update_event_item: (state: EventState, action: PayloadAction<EventItem[]>) =>{
            state.eventItems = action.payload
            localStorage.setItem('eventItems', JSON.stringify(action.payload))
        }
    }
})

export const { update_event_item } = eventSlice.actions
export default eventSlice.reducer