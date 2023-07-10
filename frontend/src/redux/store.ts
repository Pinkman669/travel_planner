import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/AuthSlice'
import tripReducer from '../features/home/tripSlice'
import placeReducer from '../features/map/placeSlice'
import eventReducer from '../features/event/eventSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        trip: tripReducer,
        place: placeReducer,
        event: eventReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;