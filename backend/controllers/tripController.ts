import { Request, Response } from "express";
import { logger } from "../logger";
import { TripService } from "../services/tripService";

export class TripController{
    constructor(private tripService: TripService){}

    addTrip = async(req: Request, res: Response) => {
        try{
            const {tripName, location, startDateStr, endDateStr, userId} = req.body
            if (!tripName || !location || !startDateStr || !endDateStr || !userId){
                throw new Error('Info missing')
            }
            await this.tripService.addTrip(tripName, location, startDateStr, endDateStr, userId)
            res.status(200).json({success: true, msg: 'Trip added'})
        }catch(e){
            logger.error(`[ERR004] ${e}`)
            res.status(400).json({success: false, msg: '[ERR004] Trip add failed'})
        }
    }

    getTrips = async(req: Request, res: Response) =>{
        try{
            const userId = Number(req.params.userId)
            if (!userId){
                throw new Error('UserID missing')
            }
            const result = await this.tripService.getTrip(userId)

            res.status(200).json({success: true, result: result})
        }catch(e){
            logger.error(`[ERR005] ${e}`)
            res.status(400).json({success: false, msg: '[ERR005] Failed to fetch trips'})
        }
    }

    removeTrip = async(req: Request, res: Response) =>{
        try{
            const tripId = Number(req.params.tripId)
            if (!tripId){
                throw new Error('Info missing')
            }
            const isTripExist = await this.tripService.getSingelTrip(tripId)

            if (!isTripExist){
                throw new Error('Trip not existed')
            }
            await this.tripService.removeTrip(tripId)
            res.status(200).json({success: true})
        }catch(e){
            logger.error(`[ERR006] ${e}`)
            res.status(400).json({success: false})
        }
    }
}