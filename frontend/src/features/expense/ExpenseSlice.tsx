import { createSlice } from "@reduxjs/toolkit";


export interface expenseState {
   budgetTab: boolean;
    expenseTab: boolean;
}

const initialState: expenseState = {
    budgetTab:false,
    expenseTab:false
};

const expenseSlice = createSlice({
    name: "expense",
    initialState,
    reducers:{
        setBudgetTab:(state:expenseState) => {
            state.budgetTab = !state.budgetTab;
        },
        setExpenseTab:(state:expenseState) => {
            state.expenseTab= !state.expenseTab;
        }
    }
})

export const {setBudgetTab,setExpenseTab} = expenseSlice.actions;
export default expenseSlice.reducer;