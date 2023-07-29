import { useQuery } from "@tanstack/react-query"

export interface ExpenseDetail{
    detail: {
        name: string,
        category: string,
        budget: number,
        expense: number,
    }[],
    allCategoryBudget:{},
    totalBudget: number, 
    totalExpense: number
}

export function useExpenseInfo (tripId:string){
    const {isLoading, error, data, isFetching} = useQuery({
        queryKey: ["expense"],
        queryFn: async ()=> {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/expense/getExpense/${tripId}`,{
                method: 'GET',
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await res.json()
            return result.result as ExpenseDetail
        }
    })

    if(isLoading || isFetching || error || !data){
        return null
    }

    return data
}