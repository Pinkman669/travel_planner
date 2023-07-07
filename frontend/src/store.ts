import {configureStore} from '@reduxjs/toolkit'
import authReducer from './features/auth/AuthSlice'
import placeReducer from './features/map/placeSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        place: placeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;