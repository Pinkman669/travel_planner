import { Knex } from 'knex';

export class ExpenseService{
    constructor(private knex: Knex) { }

    async getExpense(tripId: number) {
        const detail= await this.knex
            .select('name','category','budget','expense',)
            .from('events')
            .where('trip_id', tripId)
            .andWhere('active', true)
            .orderBy('item_order', 'asc')

        let totalExpense:number = 0
        let totalBudget:number = 0
        console.log(detail)

            for (let i = 0; i < detail.length; i++) {

                totalExpense += detail[i].expense
                totalBudget +=detail[i].budget
            }

        
        return {detail,totalBudget,totalExpense} 
    }
}