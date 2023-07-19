import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TripItem {
    id: number;
    start_date: Date;
    end_date: Date;
    location: string;
    name: string;
    user_id: number;
    DatesOfTrip?: Date[]
}

export interface TripState {
    tripItems: TripItem[]
}

export const fetchTripItemByUserId = createAsyncThunk(
    'getTrip',
    async (data: {userId: number}) =>{
        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/home/getTrip/${data.userId}`,{
            headers : {
                "Authorization":`Bearer ${localStorage.getItem('token')}`
            }
        })
        const result = await res.json()
        return result.result as TripItem[]
    }
)

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
            localStorage.setItem('tripItems', JSON.stringify(action.payload))
        }
    },
    extraReducers: (builder) =>{
        builder
            .addCase(fetchTripItemByUserId.fulfilled, (state: TripState, action: PayloadAction<TripItem[]>) =>{
                state.tripItems = action.payload
                localStorage.setItem('tripItems', JSON.stringify(action.payload))
            })
    }
})


export const { update_trip_item } = tripSlice.actions
export default tripSlice.reducer