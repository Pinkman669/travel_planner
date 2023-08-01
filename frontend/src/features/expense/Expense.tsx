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
  const tripTotal = Number(expenseResult?.totalExpense) + Number(expenseResult?.totalBudget)
  const isClickedBudget = showBudgetSubTab ? styles.isClickedTab : null
  const isClickedExpense = showExpenseSubTab ? styles.isClickedTab : null

  return (
    <div className={styles.expensePage}>
      <div className={styles.expensePageSubContainer}>
        <div className={styles.expenseTotalContainer}>
          <div className={`${styles.expenseContainer} ${isClickedBudget}`} onClick={() => setBudgetSubTab(!showBudgetSubTab)}>
            <div>Budget: </div>
            <div>SubTotal ${expenseResult?.totalBudget}</div>
          </div>
          <BudgetSubTab
            isShown={showBudgetSubTab}
            result={detail!}
            allCategoryBudget = {allCategoryBudget!}
            onHide={() => setBudgetSubTab(false)}
          />
        </div>

        <div className={styles.expenseTotalContainer}>
          <div className={`${styles.expenseContainer} ${isClickedExpense}`} onClick={() => setExpenseSubTab(!showExpenseSubTab)}>
            <div>Expense :</div>
            <div>SubTotal ${expenseResult?.totalExpense}</div>
          </div>
          <ExpenseSubTab
            isShown={showExpenseSubTab}
            result={detail!}
            allCategoryExpense ={allCategoryExpense!}
            onHide={() => setExpenseSubTab(false)}
          />
        </div>
      </div>

      <div className={styles.totalContainer}>
        <div>Trip total:</div>
        <div> ${tripTotal}</div>
      </div>
    </div>
  );
}
