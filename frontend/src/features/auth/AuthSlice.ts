import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'
import { create } from "domain";

interface AuthState{
    isAuthenticated: boolean;
    name: string | null;
}

const initialState : AuthState = {
    isAuthenticated: localStorage.getItem('token') !== null,
    name: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) =>{
            state.name = action.payload
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