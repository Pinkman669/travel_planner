import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState{
    isAuthenticated: boolean;
    name: string | null;
}

const initialState : AuthState = {
    isAuthenticated: localStorage.getItem('token') !== null,
    name: localStorage.getItem('username') || null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) =>{
            state.name = action.payload
            localStorage.setItem('username', state.name)
            state.isAuthenticated = true
        },
        logout: (state) =>{
            state.name = null
            localStorage.removeItem('token')
            state.isAuthenticated = false
        }
    }
})

export const { login, logout} = authSlice.actions
export default authSlice.reducer