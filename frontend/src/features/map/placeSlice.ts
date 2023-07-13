import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PlaceState {
    placeId: string | null;
    favourite: Boolean;
}

const initialState: PlaceState = {
    placeId: null,
    favourite: false
};

const placeSlice = createSlice({
    name: "place",
    initialState,
    reducers:{
        change_placeId:(state:PlaceState, action: PayloadAction<{placeId:string}>) => {
            state.placeId = action.payload.placeId;
        },
        setFavourite:(state:PlaceState) => {
            state.favourite = !state.favourite;
        }
    }
})

export const {change_placeId,setFavourite} = placeSlice.actions;
export default placeSlice.reducer;
