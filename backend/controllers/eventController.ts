import { EventService } from "../services/eventService";
import { logger } from "../logger";
import { Request, Response } from "express";
import errorCode from '../error-code.json'
import { isSameDay, differenceInDays } from 'date-fns'
import { calculateNumberOfDays } from "../util/utilFn";
import { tripService } from "../main";
import { FavouriteEvent } from "../util/type";

export class EventController {
    constructor(private eventService: EventService) { }

    getEvents = async (req: Request, res: Response) => {
        try {
            const tripId = Number(req.params.tripId)
            if (!tripId) {
                throw new Error('Missing tripId')
            }

            const tripItem = await tripService.getSingelTrip(tripId)
            if (!tripItem) {
                throw new Error('TripId incorrect')
            }
            const datesOfTrip = calculateNumberOfDays(tripItem)
            const eventList = await this.eventService.getEvents(tripId)

            const sortedEventMap = new Map()
            datesOfTrip.forEach((date, index) => {
                const currentDateList = eventList.filter((event) => isSameDay(new Date(event.date), new Date(date)))
                sortedEventMap.set(`day${index + 1}`, currentDateList)
            })
            const newEventItems = Object.fromEntries(sortedEventMap)

            res.status(200).json({ success: true, result: newEventItems })
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

            for (const event of eventList) {
                if (activeOrder > overOrder) {
                    if (event.id !== activeEventId && event.item_order >= overOrder && event.item_order <= activeOrder) {
                        const newItemOrder = event.item_order < Number(activeOrder) ? event.item_order + 1 : event.item_order
                        await this.eventService.updateEventOrder(event.id, newItemOrder)
                    }
                } else if (overOrder > activeOrder) {
                    if (event.id !== activeEventId && event.item_order >= activeOrder && event.item_order <= overOrder) {
                        const newItemOrder = event.item_order > Number(activeOrder) ? event.item_order - 1 : event.item_order
                        await this.eventService.updateEventOrder(event.id, newItemOrder)
                    }
                }
            }

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

            for (const event of activeEventList) {
                const newItemOrder = event.item_order > Number(activeIndex) ? event.item_order - 1 : event.item_order
                await this.eventService.updateEventDate(event.id, new Date(event.date), event.day, newItemOrder)
            }
            for (const event of overEventList) {
                if (event.id === Number(activeEventId)) {
                    await this.eventService.updateEventDate(event.id, new Date(newDate), newDay, newIndex)
                } else {
                    const newItemOrder = event.item_order >= Number(newIndex) ? event.item_order + 1 : event.item_order
                    await this.eventService.updateEventDate(event.id, new Date(event.date), event.day, newItemOrder)
                }
            }

            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR009] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR009] ${errorCode.ERR009}` })
        }
    }

    addNewEvent = async (req: Request, res: Response) => {
        try {
            const { eventList, placeId, day, tripId, locationInfo } = req.body

            if (!eventList || !placeId || !day || !tripId || !locationInfo) {
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
            const { data, tripId } = req.body
            if (!data || !tripId) {
                throw new Error('Missing favourite event info')
            }

            const favouriteEvents: FavouriteEvent[] = await this.eventService.getFavouriteEvent(tripId)
            const duplicateEvent = favouriteEvents.find((event) => event.place_id === data.place_id)
            if (duplicateEvent !== undefined) {
                throw new Error('Cannot add duplicate event')
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
            if (!isEventExist) {
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
            res.status(200).json({ success: true, result: favouriteList })
        } catch (e) {
            logger.error(`[ERR012] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR012] ${errorCode.ERR012}` })
        }
    }

    updateEventInfo = async (req: Request, res: Response) => {
        try {
            const { data, newDateStr, eventId } = req.body

            if (!data || !newDateStr || !eventId) {
                throw new Error('Missing info')
            }

            const correctNewDate = new Date(newDateStr)
            const eventItem = await this.eventService.getSingleEvent(eventId)

            if (!eventItem) {
                throw new Error('Event not existed')
            }

            if (isSameDay(eventItem.date, correctNewDate)) {
                await this.eventService.updateEvent(data, correctNewDate, eventId, eventItem.item_order, eventItem.day)
            } else {
                const oldDateEventList = await this.eventService.getEventByDate(eventItem.trip_id, eventItem.date)
                for (const event of oldDateEventList) {
                    if (event.item_order > eventItem.item_order) {
                        const newItemOrder = event.item_order - 1
                        await this.eventService.updateEventOrder(event.id, newItemOrder)
                    }
                }

                const newDateEventList = await this.eventService.getEventByDate(eventItem.trip_id, correctNewDate)
                const newItemOrder = newDateEventList.length + 1
                const dayDifference = differenceInDays(new Date(eventItem.date), correctNewDate)
                const newDay = eventItem.day - dayDifference
                await this.eventService.updateEvent(data, correctNewDate, eventId, newItemOrder, newDay)
            }
            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(`[ERR015] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR015] ${errorCode.ERR015}` })
        }
    }
}

