import { arrayMove } from "@dnd-kit/sortable";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { isSameDay } from "date-fns";
import { EventItem } from '../utils/types'
import { useAppSelector } from "../../redux/hooks";

interface Days {
    [key: string]: EventItem[]
}

interface EventState {
    new_eventItems: Days;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

interface New_update_active_order_date {
    activeContainer: string;
    overContainer: string;
    overEventList: EventItem[];
    activeInfo: EventItem;
    activeIndex: number
}

interface New_update_over_order_date {
    overContainer: string;
    activeInfo: EventItem;
    newIndex: number;
    newDate: Date;
    newDay: number;
}

interface New_update_order {
    container: string;
    activeId: number;
    overIndex: number;
    overId: number;
    activeIndex: number;
}

export const fetchEventByTrip = createAsyncThunk(
    'getEventList',
    async (data: { tripId: number }) => {
        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/event/getEvents/${data.tripId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        const result = await res.json()
        return result.result
    }
)

const initialState: EventState = localStorage.getItem('newEventItems') !== null ?
    { new_eventItems: (JSON.parse(localStorage.getItem('newEventItems') as string)), loading: 'succeeded' } :
    {
        new_eventItems: {},
        loading: 'idle'
    }

export const newEventSlice = createSlice({
    name: 'new_event',
    initialState,
    reducers: {
        new_update_event_item: (state: EventState, action: PayloadAction<Days>) => {
            state.new_eventItems = action.payload
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        },
        new_update_event_active_order_date: (state: EventState, action: PayloadAction<New_update_active_order_date>) => {
            const newActiveList = state.new_eventItems[action.payload.activeContainer].map((event) => {
                if (event.item_order > action.payload.activeIndex) {
                    event.item_order--
                }
                return event
            })
            state.new_eventItems[action.payload.activeContainer] = newActiveList
            state.new_eventItems[action.payload.activeContainer] = state.new_eventItems[action.payload.activeContainer].filter((event) => event.id !== action.payload.activeInfo.id)
            state.new_eventItems[action.payload.overContainer] = action.payload.overEventList
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        },
        new_update_event_over_order_date: (state: EventState, action: PayloadAction<New_update_over_order_date>) => {
            const newOverList = state.new_eventItems[action.payload.overContainer].map((event) => {
                if (event.item_order >= action.payload.newIndex) {
                    event.item_order++
                }
                if (event.id === action.payload.activeInfo.id) {
                    event.item_order = action.payload.activeInfo.item_order
                    event.date = action.payload.newDate
                    event.day = action.payload.newDay
                }
                return event
            })
            state.new_eventItems[action.payload.overContainer] = newOverList
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        },
        new_update_event_order: (state: EventState, action: PayloadAction<New_update_order>) => {
            const overIndex = action.payload.overIndex
            const activeIndex = action.payload.activeIndex
            let newEventList = state.new_eventItems[action.payload.container].map((event) => {
                if (event.id === action.payload.activeId) {
                    event.item_order = action.payload.overIndex
                } else{
                    if (activeIndex > overIndex){
                        if (event.item_order >=  overIndex && event.item_order <= activeIndex){
                            event.item_order++ 
                        }
                    } else if (activeIndex < overIndex){
                        if (event.item_order >= activeIndex && event.item_order <= overIndex){
                            event.item_order--
                        }
                    }
                }
                return event
            })
            newEventList = arrayMove(newEventList, action.payload.activeIndex - 1, action.payload.overIndex - 1)

            state.new_eventItems[action.payload.container] = newEventList
            localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventByTrip.fulfilled, (state: EventState, action: PayloadAction<Days>) => {
                state.new_eventItems = action.payload
                localStorage.setItem('newEventItems', JSON.stringify(state.new_eventItems))
            })
    }
})

export const {
    new_update_event_item,
    new_update_event_active_order_date,
    new_update_event_over_order_date,
    new_update_event_order
} = newEventSlice.actions
export default newEventSlice.reducer