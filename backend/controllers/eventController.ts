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

    updateEventOrder = async(req: Request, res: Response) =>{
        try{
            const {activeEventId, overEventId, activeOrder, overOrder} = req.body
            if (!activeEventId || !overEventId || !activeOrder || !overOrder){
                throw new Error('Missing update info')
            }
            await this.eventService.updateEventOrder(activeEventId, overOrder)
            await this.eventService.updateEventOrder(overEventId, activeOrder)
            res.status(200).json({success: true})
        }catch(e){
            logger.error(`[ERR008] ${e}`)
            res.status(400).json({success: false, msg: `[ERR008] ${errorCode.ERR008}`})
        }
    }
}