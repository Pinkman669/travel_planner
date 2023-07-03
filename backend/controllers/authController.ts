import { AuthService } from "../services/authService";
import { checkPassword, hashPassword } from "../hash";
import { Request, Response } from "express";
import { User } from '../services/models'
import { logger } from "../logger";


export class AuthController{
    constructor(private authService: AuthService){}

    signUp = async(req: Request, res: Response) =>{
        try{
            const {name, email, password, birthday}: User = req.body
            const userInfo: User = await this.authService.userInfo(email)
            if (userInfo){
                throw new Error('User existed')
            }
            const hashedPassword = await hashPassword(password)
            this.authService.signUp(name, email, hashedPassword, birthday)
            res.status(200).json({success: true, msg: ('Users created')})
        } catch(e){
            res.status(400).json({success: false, msg: `[ER001] ${e}`})
            logger.error(`[ER001] User sign up error ${e}`)
        }
    }

    login = async(req: Request, res: Response) =>{
        try{
            const {email, password}: User = req.body
            if (!email || !password){
                throw new Error('Missing email or password')
            }
            const userInfo: User = await this.authService.userInfo(email)
            if (!userInfo){
                throw new Error('User not found')
            }
            const result = await checkPassword(password, userInfo.password)
            if (!result){
                throw new Error('Email or password not match')
            }
            res.status(200).json({success: true, msg: "Login succeeded"})
        }catch(e){
            logger.error(`[ER002] login failed ${e}`)
            res.status(400).json({success: false, msg: `[ER002] login failed ${e}`})
        }
    }
}