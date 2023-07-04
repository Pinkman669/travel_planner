import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { facebookLogin } from "./AuthAPI"
import { login } from "./AuthSlice"
import { notify } from "../utils/utils"
import { Navigate } from "react-router-dom"


export function FacebookCallback(){
    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

    useEffect(() =>{
        const searchParams = new URLSearchParams(window.location.search)
        const code = searchParams.get('code') || '';

        (async function(){
            console.log('facebook callback')
            const data = await facebookLogin(code)
            if (data){
                dispatch(login(data.name))
            } else{
                notify(false, 'Login failed')
            }
        })()
    }, [dispatch])

    if (isAuthenticated){
        return <Navigate to='/' replace />
    } else{
        console.log('isAuthenticated is false')
    }

    return <h3>Redirecting...</h3>
}