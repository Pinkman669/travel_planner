import { Knex } from 'knex';
import { sortingBudgetAndExpense } from '../util/utilFn';

export class ExpenseService {
    constructor(private knex: Knex) { }

    async getExpense(tripId: number) {
        const detail = await this.knex
            .select('name', 'category', 'budget', 'expense',)
            .from('events')
            .where('trip_id', tripId)
            .andWhere('active', true)
            .orderBy('item_order', 'asc')

        const { allCategoryBudget, allCategoryExpense, totalExpense, totalBudget } = sortingBudgetAndExpense(detail)

        return { detail, allCategoryBudget, allCategoryExpense, totalBudget, totalExpense }
    }
}