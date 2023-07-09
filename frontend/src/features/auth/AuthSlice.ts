import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserInfo{
    name: string;
    userId: number;
}

interface AuthState{
    isAuthenticated: boolean;
    name: string | null;
    userId: number | null;
}

const initialState : AuthState = {
    isAuthenticated: localStorage.getItem('token') !== null,
    name: localStorage.getItem('username') || null,
    userId: Number(localStorage.getItem('userId')) || null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserInfo>) =>{
            state.name = action.payload.name
            state.userId = action.payload.userId
            localStorage.setItem('username', state.name)
            localStorage.setItem('userId', (state.userId + ''))
            state.isAuthenticated = true
        },
        logout: (state) =>{
            state.name = null
            localStorage.clear()
            state.isAuthenticated = false
        }
    }
})

export const { login, logout} = authSlice.actions
export default authSlice.reducer