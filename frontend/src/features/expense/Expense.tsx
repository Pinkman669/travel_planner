import { useParams } from "react-router-dom";
import { useExpenseInfo } from "./ExpenseAPI";
import "../../css/expense.css"

export function Expense() {
    const { tripId } = useParams();
    const result = useExpenseInfo(tripId!)
  return (
    <div className="expense-page">
      <div className="expense-container">
        <div>Budget</div>
        <div>
            ${result?.totalBudget}

        </div>
      </div>

      <div className="expense-container">
        <div>Expense</div>
        <div>${result?.totalExpense}</div>
      </div>

      <div className="expense-container total-container">
        <div>Total</div>
        <div>${result?.totalExpense}</div>
      </div>
    </div>
  );
}
