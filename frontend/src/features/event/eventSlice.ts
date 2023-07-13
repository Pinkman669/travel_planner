import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EventItem {
    id: number;
    name: string;
    date: Date | string;
    time: Date;
    location: string;
    business_hours: string;
    phone: string;
    website: string;
    budget: number;
    expense: number;
    trip_id: number;
    category: string;
    item_order: number;
    day: number;
}

interface UpdateEventOrder {
    day: number;
    date: Date | string;
    item_order: number;
    id: number;
}

interface EventState {
    eventItems: EventItem[]
}

const initialState: EventState = localStorage.getItem('eventItems') !== null ?
    { eventItems: JSON.parse(localStorage.getItem('eventItems') as string) } :
    {
        eventItems: []
    }

export const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        update_event_item: (state: EventState, action: PayloadAction<EventItem[]>) => {
            state.eventItems = action.payload
            localStorage.setItem('eventItems', JSON.stringify(state.eventItems))
        },
        update_event_order: (state: EventState, action: PayloadAction<UpdateEventOrder>) => {
            state.eventItems = state.eventItems.map((event) => {
                if (event.id === action.payload.id) {
                    event.day = action.payload.day
                    event.date = action.payload.date
                    event.item_order = action.payload.item_order
                }
                return event
            })
            localStorage.setItem('eventItems', JSON.stringify(state.eventItems))
        }
    }
})

export const { update_event_item, update_event_order } = eventSlice.actions
export default eventSlice.reducer