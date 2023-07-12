import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EventItem {
    id: number;
    name: string;
    date: Date|string;
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

interface Days{
    [key: string]: EventItem[]
}

interface EventState {
    new_eventItems: Days
}

interface New_update_order_date{
    activeContainer: string;
    activeEventList: EventItem[];
    overContainer: string;
    overEventList: EventItem[]
}

interface New_update_order{
    container: string;
    eventlist: EventItem[];
}

const initialState: EventState = localStorage.getItem('newEventItems') !== null ?
    { new_eventItems: JSON.parse(localStorage.getItem('newEventItems') as string) } :
    {
        new_eventItems: []
    }

export const newEventSlice = createSlice({
    name: 'new_event',
    initialState,
    reducers: {
        new_update_event_item: (state: EventState, action: PayloadAction<Days>) => {
            state.new_eventItems = action.payload
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        },
        new_update_event_order_date: (state: EventState, action: PayloadAction<New_update_order_date>) =>{
            state.new_eventItems[action.payload.activeContainer] = action.payload.activeEventList
            state.new_eventItems[action.payload.overContainer] = action.payload.overEventList
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        },
        new_update_event_order: (state: EventState, action: PayloadAction<New_update_order>) =>{
            state.new_eventItems[action.payload.container] = action.payload.eventlist
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        }
    }
})

export const { new_update_event_item, new_update_event_order_date, new_update_event_order } = newEventSlice.actions
export default newEventSlice.reducer