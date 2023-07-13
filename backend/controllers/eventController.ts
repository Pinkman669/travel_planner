import { EventService } from "../services/eventService";
import { logger } from "../logger";
import { Request, Response } from "express";
import errorCode from '../error-code.json'

export class EventController {
    constructor(private eventService: EventService) { }

    getEvents = async (req: Request, res: Response) => {
        try {
            const tripId = Number(req.params.tripId)
            if (!tripId) {
                throw new Error('Missing tripId')
            }
            const eventList = await this.eventService.getEvents(tripId)
            res.status(200).json({ success: true, result: eventList})
        } catch (e) {
            logger.error(`[ERR007] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR007] ${errorCode.ERR007}` })
        }
    }

    updateEventOrder = async (req: Request, res: Response) => {
        try {
            console.log('changing order!!!!!!!!!!!')
            const { activeEventId, overEventId, activeOrder, overOrder } = req.body
            if (!activeEventId || !overEventId ) {
                throw new Error('Missing update info')
            }
            if (activeOrder < 0 || overOrder < 0){
                throw new Error('Missing update info')
            }
            await this.eventService.updateEventOrder(activeEventId, overOrder)
            await this.eventService.updateEventOrder(overEventId, activeOrder)
            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR008] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR008] ${errorCode.ERR008}` })
        }
    }

    updateDayEventOrder = async (req: Request, res: Response) => {
        try {
            console.log('change order and date!!!!!!!')
            const { activeEventList, overEventList, newDate, newDay, newIndex , activeEventId, activeIndex } = req.body
            if (!activeEventList || !overEventList || !newDate || !newDay || !newIndex || !activeEventId || !activeIndex) {
                throw new Error('Missing info')
            }

            activeEventList.forEach(async (event: any) => {
                console.log('newIndex: ' + activeIndex)
                const newItemOrder = event.item_order > Number(activeIndex) ? event.item_order - 1 : event.item_order
                console.log('origin: ' + event.item_order ,'newOrder: ' + newItemOrder, 'id: '+ event.id)
                await this.eventService.updateEventDate(event.id, new Date(event.date), event.day, newItemOrder)
            });
            overEventList.forEach(async (event: any) => {
                if (event.id === Number(activeEventId)){
                    await this.eventService.updateEventDate(event.id, new Date(newDate), newDay, newIndex)
                } else{
                    console.log('name: ' + event.name, 'order: ' + event.item_order, 'newIndex: ' + newIndex)
                    const newItemOrder = event.item_order >= Number(newIndex) ? event.item_order + 1 : event.item_order
                    console.log('newOrder: ' + newItemOrder)
                    await this.eventService.updateEventDate(event.id, new Date(event.date), event.day, newItemOrder)
                }
            });
            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR009] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR009] ${errorCode.ERR009}` })
        }
    }
}