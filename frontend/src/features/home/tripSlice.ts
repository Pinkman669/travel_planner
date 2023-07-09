import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TripItem {
    id: number;
    start_date: Date;
    end_date: Date;
    location: string;
    name: string;
    user_id: number;
}

export interface TripState {
    tripItems: TripItem[]
}

const initialState: TripState = localStorage.getItem('tripItems') !== null ?
    { tripItems: JSON.parse(localStorage.getItem('tripItems') as string) } :
    {
        tripItems: []
    }

export const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        update_trip_item: (state: TripState, action: PayloadAction<TripItem[]>) => {
            state.tripItems = action.payload
            localStorage.setItem('tripItems', JSON.stringify(action.payload))
        }
    }
})

export const { update_trip_item } = tripSlice.actions
export default tripSlice.reducer