import { useParams } from "react-router-dom";
import { useExpenseInfo } from "./ExpenseAPI";
import { BudgetSubTab } from "./ExpenseSubTab";
import { useState } from "react";
import styles from '../../css/Expense.module.css';

export function Expense() {
  const { tripId } = useParams();
  const expenseResult = useExpenseInfo(tripId!);
  const [showBudgetSubTab, setBudgetSubTab] = useState(false);
  const [showExpenseSubTab, setExpenseSubTab] = useState(false);
  const detail = expenseResult?.detail;

  return (
    <div className={styles.expensePage}>
      <div className={styles.expenseContainer} onClick={() => setBudgetSubTab(!showBudgetSubTab)}>
        <div>Budget</div>
        <div>
          ${expenseResult?.totalBudget}
        </div>
      </div>
      <BudgetSubTab
        isShown={showBudgetSubTab}
        result={detail!}
        onHide={() => setBudgetSubTab(false)}
        isBudget
      />

      <div className={styles.expenseContainer} onClick={() => setExpenseSubTab(!showExpenseSubTab)}>
        <div>Expense</div>
        <div onClick={() => setExpenseSubTab(true)}>
          ${expenseResult?.totalExpense}
        </div>
      </div>
      <BudgetSubTab
        isShown={showExpenseSubTab}
        result={detail!}
        onHide={() => setExpenseSubTab(false)}
        isBudget={false}
      />

      <div className={`${styles.expenseContainer} ${styles.totalContainer}`}>
        <div>Total</div>
        <div>${expenseResult?.totalExpense}</div>
      </div>
    </div>
  );
}
