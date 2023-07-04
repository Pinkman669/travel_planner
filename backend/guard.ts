import jwt from "./jwt";
import jwtSimple from "jwt-simple";
import express from "express";
import { User } from "./services/models";
import { Bearer } from "permit";

const permit = new Bearer({
    query: "access_token"
})

export async function isLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try{
        const token = permit.check(req)
        if (!token){
            return res.status(401).json({msg: 'Permission Denied'})
        }

        const decoded: Omit<User, 'password'> = jwtSimple.decode(token, jwt.jwtSecret)
        req.user = decoded

        console.log("guard check", req.user)

        return next()
    } catch(e){
        return res.status(401).json({msg: "Permission Denied"})
    }
}