import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface DayState {
    selected_day_trip: string | null;
}

const initialState: DayState = {
    selected_day_trip: null
}

export const daySlice = createSlice({
    name: 'select_day_trip',
    initialState,
    reducers: {
        select_day_trip: (state: DayState, action: PayloadAction<string>) => {
            state.selected_day_trip = action.payload
        }
    }
})


export const { select_day_trip } = daySlice.actions
export default daySlice.reducer