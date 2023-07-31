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
        let allCategoryBudget = {}

            for (let i = 0; i < detail.length; i++) {

                totalExpense += detail[i].expense
                totalBudget +=detail[i].budget

                
                let categoryName = detail[i].category
                let categoryBudget= detail[i].budget
                if (detail[i].category === detail[i-1].category ){
                
                    allCategoryBudget[categoryName]+= categoryBudget

                }else {

                    allCategoryBudget[categoryName]= categoryBudget

                }
            }
        
        return {detail,allCategoryBudget,totalBudget,totalExpense} 
    }
}