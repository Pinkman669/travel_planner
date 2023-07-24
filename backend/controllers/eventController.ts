import { EventService } from "../services/eventService";
import { logger } from "../logger";
import { Request, Response } from "express";
import errorCode from '../error-code.json'
import { isSameDay } from 'date-fns'

export class EventController {
    constructor(private eventService: EventService) { }

    getEvents = async (req: Request, res: Response) => {
        try {
            const tripId = Number(req.params.tripId)
            if (!tripId) {
                throw new Error('Missing tripId')
            }
            const eventList = await this.eventService.getEvents(tripId)
            res.status(200).json({ success: true, result: eventList })
        } catch (e) {
            logger.error(`[ERR007] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR007] ${errorCode.ERR007}` })
        }
    }

    updateEventOrder = async (req: Request, res: Response) => {
        try {
            const { activeEventId, activeOrder, overOrder, eventList } = req.body
            if (!activeEventId || !eventList) {
                throw new Error('Missing update info')
            }
            if (activeOrder < 0 || overOrder < 0) {
                throw new Error('Missing update info')
            }
            await this.eventService.updateEventOrder(activeEventId, overOrder)
            eventList.forEach(async (event: any) => {
                if (activeOrder > overOrder){
                    if (event.id !== activeEventId && event.item_order >= overOrder && event.item_order <= activeOrder) {
                        const newItemOrder = event.item_order < Number(activeOrder) ? event.item_order + 1 : event.item_order
                        await this.eventService.updateEventOrder(event.id, newItemOrder)
                    }
                } else if (overOrder > activeOrder){
                    if (event.id !== activeEventId && event.item_order >= activeOrder && event.item_order <= overOrder) {
                        const newItemOrder = event.item_order > Number(activeOrder) ? event.item_order - 1 : event.item_order
                        await this.eventService.updateEventOrder(event.id, newItemOrder)
                    }
                }
            })
            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR008] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR008] ${errorCode.ERR008}` })
        }
    }

    updateDayEventOrder = async (req: Request, res: Response) => {
        try {
            const { activeEventList, overEventList, newDate, newDay, newIndex, activeEventId, activeIndex } = req.body
            if (!activeEventList || !overEventList || !newDate || !newDay || !newIndex || !activeEventId || !activeIndex) {
                throw new Error('Missing info')
            }

            activeEventList.forEach(async (event: any) => {
                const newItemOrder = event.item_order > Number(activeIndex) ? event.item_order - 1 : event.item_order
                await this.eventService.updateEventDate(event.id, new Date(event.date), event.day, newItemOrder)
            });
            overEventList.forEach(async (event: any) => {
                if (event.id === Number(activeEventId)) {
                    await this.eventService.updateEventDate(event.id, new Date(newDate), newDay, newIndex)
                } else {
                    const newItemOrder = event.item_order >= Number(newIndex) ? event.item_order + 1 : event.item_order
                    await this.eventService.updateEventDate(event.id, new Date(event.date), event.day, newItemOrder)
                }
            });
            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR009] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR009] ${errorCode.ERR009}` })
        }
    }

    addNewEvent = async (req: Request, res: Response) => {
        try {
            const { eventList, placeId, day, tripId, locationInfo } = req.body
            if (!eventList || !placeId || !day || !tripId) {
                throw new Error('Missing new event info')
            }

            await this.eventService.addNewEvent(eventList, placeId, day, tripId, locationInfo)

            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR0010] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR0010] ${errorCode.ERR010}` })
        }
    }

    addFavouriteEvent = async (req: Request, res: Response) => {
        try {
            console.log('Favourite event')
            const { data, tripId } = req.body
            if (!data || !tripId) {
                throw new Error('Missing favourite event info')
            }

            await this.eventService.addFavouriteEvent(data, tripId)

            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR011] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR011] ${errorCode.ERR011}` })
        }
    }

    removeEvent = async (req: Request, res: Response) => {
        try {
            const { eventId } = req.body
            if (!eventId) {
                throw new Error('Missing event info')
            }
            const isEventExist = await this.eventService.getSingleEvent(eventId)
            if (!isEventExist){
                throw new Error('Event not existed')
            }
            await this.eventService.removeEvent(eventId)
            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR013] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR013] ${errorCode.ERR013}` })
        }
    }
    getFavouriteEvent = async (req: Request, res: Response) => {
        try {
            const tripId = Number(req.params.tripId)
            if (!tripId) {
                throw new Error('Missing tripId')
            }
            const favouriteList = await this.eventService.getFavouriteEvent(tripId)
            res.status(200).json({ success: true, result: favouriteList})
        } catch (e) {
            logger.error(`[ERR012] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR012] ${errorCode.ERR012}` })
        }
    }

    updateEventInfo = async (req: Request, res: Response) =>{
        try{
            const {data, newDate, eventId} = req.body
            if (!data || !newDate || !eventId){
                throw new Error('Missing info')
            }
            const newDatePlus = new Date(newDate)
            const eventItem = await this.eventService.getSingleEvent(eventId)
            if (!eventItem){
                throw new Error('Event not existed')
            }
            if (isSameDay(eventItem.date, newDatePlus)){
                await this.eventService.updateEvent(data, newDatePlus, eventId, eventItem.item_order, eventItem.day)
            } else{
                const oldDateEventList = await this.eventService.getEventByDate(eventItem.trip_id, eventItem.date)
                oldDateEventList.forEach(async (event) =>{
                    if (event.item_order > eventItem.item_order){
                        const newItemOrder = event.item_order - 1
                        await this.eventService.updateEventOrder(event.id, newItemOrder)
                    }
                })

                const newDateEventList = await this.eventService.getEventByDate(eventItem.trip_id, newDatePlus)
                const newItemOrder = newDateEventList.length + 1
                await this.eventService.updateEvent(data, newDatePlus, eventId, newItemOrder, newDateEventList[0].day)

            }
            res.status(200).json({success: true})
        }catch(e){
            logger.error(`[ERR014] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR014] ${errorCode.ERR014}` })
        }
    }
}

