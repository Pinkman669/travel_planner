import { isLoggedIn } from "./guard";
import { authController, tripController, eventController, expenseController } from "./main";
import express from "express";

export function authRouter() {
    const route = express.Router()

    route.post('/sign-up', authController.signUp)
    route.post('/login', authController.login)
    route.post('/login/facebook', authController.loginFacebook)

    return route
}

export function tripRouter() {
    const route = express.Router()

    route.get('/getTrip/:userId', isLoggedIn, tripController.getTrips)
    route.post('/addTrip', isLoggedIn, tripController.addTrip)
    route.put('/removeTrip/:tripId', isLoggedIn, tripController.removeTrip)

    return route
}

export function eventRouter() {
    const route = express.Router()

    route.get('/getEvents/:tripId', isLoggedIn, eventController.getEvents)
    route.put('/updateEventOrder', isLoggedIn, eventController.updateEventOrder)
    route.put('/updateDayEventOrder', isLoggedIn, eventController.updateDayEventOrder)
    route.post('/addNewEvent', isLoggedIn,eventController.addNewEvent)
    route.put('/removeEvent', isLoggedIn, eventController.removeEvent)
    route.post('/addNewEvent', isLoggedIn, eventController.addNewEvent)
    route.post('/addFavouriteLocation', isLoggedIn, eventController.addFavouriteEvent)
    route.get('/getFavouriteEvent/:tripId', isLoggedIn, eventController.getFavouriteEvent)
    route.put('/updateEventInfo', isLoggedIn, eventController.updateEventInfo)

    return route
}

export function expenseRouter() {
    const route = express.Router()

    route.get('/getExpense/:tripId', isLoggedIn, expenseController.getExpense)
    
    return route
}