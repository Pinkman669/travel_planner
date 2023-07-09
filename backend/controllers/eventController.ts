import { EventService } from "../services/eventService";
import { logger } from "../logger";
import { Request, Response } from "express";
import errorCode from '../error-code.json'

export class EventController{
    constructor(private eventService: EventService){}

    getEvents = async(req: Request, res: Response) =>{
        try{
            const tripId = Number(req.params.tripId)
            if (!tripId){
                throw new Error('Missing tripId')
            }
            const eventList = await this.eventService.getEvents(tripId)
            res.status(200).json({success: true, result: eventList})
        }catch(e){
            logger.error(`[ERR007] ${e}`)
            res.status(400).json({success: false, msg: `[ERR007] ${errorCode.ERR007}`})
        }
    }
}