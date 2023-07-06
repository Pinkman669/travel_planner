import { isLoggedIn } from "./guard";
import { authController, tripController } from "./main";
import express from "express";

export function authRouter(){
    const route = express.Router()

    route.post('/sign-up', authController.signUp)
    route.post('/login', authController.login)
    route.post('/login/facebook', authController.loginFacebook)
    
    return route
}

export function tripRouter(){
    const route = express.Router()

    route.post('/addTrip', isLoggedIn, tripController.addTrip)

    return route
}