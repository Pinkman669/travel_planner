import { isLoggedIn } from "./guard";
import { authController, tripController, eventController } from "./main";
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

    route.get('/getTrip/:userId', isLoggedIn, tripController.getTrips)
    route.post('/addTrip', isLoggedIn, tripController.addTrip)
    route.put('/removeTrip/:tripId', isLoggedIn, tripController.removeTrip)

    return route
}

export function eventRouter(){
    const route = express.Router()

    route.get('/getEvents/:tripId', isLoggedIn, eventController.getEvents)

    return route
}