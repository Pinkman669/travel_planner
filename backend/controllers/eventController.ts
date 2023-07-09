import { EventService } from "../services/eventService";
import { logger } from "../logger";
import { Request, Response } from "express";
import errorCode from '../error-code.json'

export class EventController{
    constructor(private eventService: EventService){}

    getEvents = async(req: Request, res: Response) =>{
        try{

        }catch(e){
            logger.error(`[ERR007] ${errorCode['ERR007']}`)
        }
    }
}