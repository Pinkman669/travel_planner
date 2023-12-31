import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/AuthSlice'
import tripReducer from '../features/home/tripSlice'
import placeReducer from '../features/map/placeSlice'
import newEventReducer from '../features/event/newEventSlice'
import dayReducer from '../features/event/daySlice'
import expenseReducer from '../features/expense/ExpenseSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        trip: tripReducer,
        place: placeReducer,
        new_event: newEventReducer,
        day: dayReducer,
        expense:expenseReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;