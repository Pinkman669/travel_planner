import { useParams } from "react-router-dom";
import { useExpenseInfo } from "./ExpenseAPI";
import { BudgetSubTab } from "./BudgetSubTab";
import { useState } from "react";
import styles from '../../css/Expense.module.css';
import { ExpenseSubTab } from "./ExpenseSubTab";

export function Expense() {
  const { tripId } = useParams();
  const expenseResult = useExpenseInfo(tripId!);
  const [showBudgetSubTab, setBudgetSubTab] = useState(false);
  const [showExpenseSubTab, setExpenseSubTab] = useState(false);
  const detail = expenseResult?.detail;
  const allCategoryBudget = expenseResult?.allCategoryBudget;
  const allCategoryExpense = expenseResult?.allCategoryExpense;

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
        allCategoryBudget = {allCategoryBudget!}
        onHide={() => setBudgetSubTab(false)}
      />

      <div className={styles.expenseContainer} onClick={() => setExpenseSubTab(!showExpenseSubTab)}>
        <div>Expense</div>
        <div onClick={() => setExpenseSubTab(true)}>
          ${expenseResult?.totalExpense}
        </div>
      </div>
      <ExpenseSubTab
        isShown={showExpenseSubTab}
        result={detail!}
        allCategoryExpense ={allCategoryExpense!}
        onHide={() => setExpenseSubTab(false)}
      />

      <div className={`${styles.expenseContainer} ${styles.totalContainer}`}>
        <div>Total</div>
        <div>${expenseResult?.totalExpense}</div>
      </div>
    </div>
  );
}
