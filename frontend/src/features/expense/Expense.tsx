import { useParams } from "react-router-dom";
import { useExpenseInfo } from "./ExpenseAPI";
import "../../css/Expense.css";
import { BudgetSubTab, ExpenseSubTab } from "./ExpenseSubTab";
import { useState } from "react";

export function Expense() {
  const { tripId } = useParams();
  const expenseResult = useExpenseInfo(tripId!);
  const [showBudgetSubTab, setBudgetSubTab] = useState(false);
  const [showExpenseSubTab, setExpenseSubTab] = useState(false);
  const detail = expenseResult?.detail;
  console.log(`result: ${detail}`);
  return (
    <div className="expense-page">
      <div className="expense-container" onClick={() => setBudgetSubTab(!showBudgetSubTab)}>
        <div>Budget</div>
        <div>
          ${expenseResult?.totalBudget}
        </div>
      </div>
      <BudgetSubTab
        isShown={showBudgetSubTab}
        result={detail!}
        onHide={() => setBudgetSubTab(false)}
      />

      <div className="expense-container"onClick={() => setExpenseSubTab(!showExpenseSubTab)}>
        <div>Expense</div>
        <div onClick={() => setExpenseSubTab(true)}>
          ${expenseResult?.totalExpense}
        </div>
      </div>
      <ExpenseSubTab
        isShown={showExpenseSubTab}
        result={detail!}
        onHide={() => setExpenseSubTab(false)}
      />

      <div className="expense-container total-container">
        <div>Total</div>
        <div>${expenseResult?.totalExpense}</div>
      </div>
    </div>
  );
}
