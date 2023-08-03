import { AuthService } from "../services/authService";
import { checkPassword, hashPassword } from "../hash";
import { Request, Response } from "express";
import { User } from '../util/type'
import { logger } from "../logger";
import jwtSimple from "jwt-simple";
import jwt from "../jwt";
import crypto from 'crypto'

export class AuthController {
    constructor(private authService: AuthService) { }

    signUp = async (req: Request, res: Response) => {
        try {
            const { name, email, password, birthday }: User = req.body
            const userInfo: User = await this.authService.userInfo(email)
            if (userInfo) {
                throw new Error('User existed')
            }
            const hashedPassword = await hashPassword(password)
            await this.authService.signUp(name, email, hashedPassword, birthday)
            res.status(200).json({ success: true, msg: ('Users created') })
        } catch (e) {
            res.status(400).json({ success: false, msg: `[ER001] ${e}` })
            logger.error(`[ER001] User sign up error ${e}`)
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password }: User = req.body
            if (!email || !password) {
                throw new Error('Missing email or password')
            }
            const userInfo: User = await this.authService.userInfo(email)
            if (!userInfo) {
                throw new Error('User not found')
            }
            const result = await checkPassword(password, userInfo.password)
            if (!result) {
                throw new Error('Email or password not match')
            }
            const payload = {
                id: userInfo.id,
                name: userInfo.name,
                birthday: userInfo.birthday,
                email: userInfo.email
            }
            const token = jwtSimple.encode(payload, jwt.jwtSecret + '')
            res.status(200).json({ token: token, name: userInfo.name, userId: userInfo.id })
        } catch (e) {
            logger.error(`[ER002] login failed ${e}`)
            res.status(400).json({ success: false, msg: `[ER002] login failed ${e}` })
        }
    }

    loginFacebook = async (req: Request, res: Response) => {
        try {
            const { code } = req.body
            if (!code) {
                throw new Error('Invalid code')
            }

            const fetchResponse = await fetch(`https://graph.facebook.com/oauth/access_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: process.env.FACEBOOK_CLIENT_ID + "",
                    client_secret: process.env.FACEBOOK_CLIENT_SECRET + "",
                    code: code + "",
                    redirect_uri: `${process.env.REACT_PUBLIC_HOSTNAME}/facebook-callback`
                })
            });

            const data = await fetchResponse.json()
            logger.info('access_token: ' + data.access_token)
            logger.info('client_id: ' + process.env.FACEBOOK_CLIENT_ID)
            logger.info('client_secret: ' + process.env.FACEBOOK_CLIENT_SECRET)
            logger.info('redirect_uri: ' + process.env.REACT_PUBLIC_HOSTNAME)
            if (!data.access_token) {
                throw new Error('No access token')
            }

            const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${data.access_token}`);
            const userInfo = await profileResponse.json()
            let user: User = await this.authService.userInfo(userInfo.email)

            if (!user){
                const hashedPassword = await hashPassword(crypto.randomBytes(48).toString())
                user = await this.authService.signUp(userInfo.name, userInfo.email, hashedPassword, userInfo.birthday)
            }
            const payload = {
                id: user.id,
                name: user.name,
                birthday: user.birthday,
                email: user.email
            }
            const token = jwtSimple.encode(payload, jwt.jwtSecret + '')
            res.status(200).json({ token: token, name: user.name , userId: user.id})
        } catch (e) {
            logger.error(`[ER002] login failed ${e}`)
            res.status(400).json({ success: false, msg: `[ER002] login failed ${e}` })
        }
    }
}