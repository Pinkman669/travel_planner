import { authController } from "./main";
import express from "express";

export function authRouter(){
    const route = express.Router()

    route.post('/sign-up', authController.signUp)
    route.post('/login', authController.login)

    return route
}