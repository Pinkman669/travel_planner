import { addDays, differenceInDays } from "date-fns"
import { TripItem, BudgetAndExpenseItem } from "./type"

export function calculateNumberOfDays(tripInfo: TripItem) {
    const numberOfDays = differenceInDays(new Date(tripInfo.end_date), new Date(tripInfo.start_date)) + 1
    const startDate = new Date(tripInfo.start_date)
    const DatesOfTrip = []
    for (let i = 0; i < numberOfDays; i++) {
        DatesOfTrip.push(addDays(startDate, i).toDateString())
    }
    return DatesOfTrip
}

export function sortingBudgetAndExpense(EventItems: BudgetAndExpenseItem[]) {

    let totalExpense: number = 0
    let totalBudget: number = 0
    const allCategoryBudgetMap = new Map()
    const allCategoryExpenseMap = new Map()
    const othersCategory = 'others'

    for (let i = 0; i < EventItems.length; i++) {

        totalExpense += EventItems[i].expense
        totalBudget += EventItems[i].budget

        const categoryName = EventItems[i].category
        const categoryBudget = EventItems[i].budget
        const categoryExpense = EventItems[i].expense

        if (categoryName) {
            if (allCategoryBudgetMap.has(categoryName)) {
                const newBudget = allCategoryBudgetMap.get(categoryName)
                allCategoryBudgetMap.set(categoryName, newBudget + categoryBudget)
            } else {
                allCategoryBudgetMap.set(categoryName, categoryBudget)
            }

            if (allCategoryExpenseMap.has(categoryName)) {
                const newExpense = allCategoryExpenseMap.get(categoryName)
                allCategoryExpenseMap.set(categoryName, newExpense + categoryExpense)
            } else {
                allCategoryExpenseMap.set(categoryName, categoryExpense)
            }
        } else {
            if (allCategoryBudgetMap.has(othersCategory)) {
                const newBudget = allCategoryBudgetMap.get(othersCategory)
                allCategoryBudgetMap.set(othersCategory, newBudget + categoryBudget)
            } else {
                allCategoryBudgetMap.set(othersCategory, categoryBudget)
            }

            if (allCategoryExpenseMap.has(othersCategory)) {
                const newExpense = allCategoryExpenseMap.get(othersCategory)
                allCategoryExpenseMap.set(othersCategory, newExpense + categoryBudget)
            } else {
                allCategoryExpenseMap.set(othersCategory, categoryExpense)
            }
        }

    }
    const allCategoryBudget = Object.fromEntries(allCategoryBudgetMap)
    const allCategoryExpense = Object.fromEntries(allCategoryExpenseMap)

    return { allCategoryBudget, allCategoryExpense, totalExpense, totalBudget }
}