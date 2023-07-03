import { AuthService } from "../services/authService";
import { checkPassword, hashPassword } from "../hash";
import { Request, Response } from "express";
import { User } from '../services/modals'


export class AuthController{
    constructor(private authService: AuthService){}

    signUp = async(req: Request, res: Response) =>{
        try{
            const userInfo = this.authService.userInfo
            if (userInfo.length){
                res.json({success: false, msg: 'User existed'})
            }
            const {name, email, password, birthday}: User = req.body
            const hashedPassword = await hashPassword(password)
            this.authService.signUp(name, email, hashedPassword, birthday)
            res.status(200).json({success: true, msg: {'User created'}})
        } catch(e){
            res.status(400).json({success: false, msg: '[ER001] Sign up failed'})
        }
    }
}