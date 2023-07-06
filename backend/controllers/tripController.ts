import { Request, Response } from "express";
import { logger } from "../logger";
// import jwtSimple from "jwt-simple";
// import jwt from "../jwt";
import { TripService } from "../services/tripService";


export class TripController{
    constructor(private tripService: TripService){}

    addTrip = async(req: Request, res: Response) =>{
        try{
            const {tripName, location, startDate, endDate} = req.body
            if (!tripName || !location || !startDate || !endDate){
                throw new Error('Info missing')
            }
            await this.tripService.addTrip(tripName, location, startDate, endDate)
            res.status(200).json({success: true, msg: 'Trip added'})
        }catch(e){
            logger.error(`[ERR004] ${e}`)
            res.status(400).json({success: false, msg: 'Trip add failed'})
        }
    }
}