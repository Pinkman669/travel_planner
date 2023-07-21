
import { Request, Response } from "express";
import { logger } from "../logger";
import errorCode from '../error-code.json'
import { ExpenseService } from "../services/ExpenseService";

export class ExpenseController{
    constructor (private expenseService: ExpenseService){}

    getExpense = async(req: Request, res: Response) => {
        try {
            const tripId = Number(req.params.tripId)
            if (!tripId) {
                throw new Error('Missing tripId')
            }
            const expenseList = await this.expenseService.getExpense(tripId)
            res.status(200).json({ success: true, result: expenseList })
        } catch (e) {
            logger.error(`[ERR014] ${e}`)
            res.status(400).json({ success: false, msg: `[ERR014] ${errorCode.ERR013}` })
        }
    }
}