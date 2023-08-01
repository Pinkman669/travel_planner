import { Collapse } from 'react-bootstrap';
import styles from '../../css/Expense.module.css';
import { BudgetSubItem } from './BudgetSubItem';

export interface subTabProps {
  isShown: boolean;
  result: { name: string; category: string; budget: number; expense: number }[];
  allCategoryBudget: {
    [key: string]: number
  };
  onHide: () => void;
}

export function BudgetSubTab(props: subTabProps) {

  const show = props.isShown;
  const allCategoryBudget = props.allCategoryBudget

  return (
    <>
      <Collapse in={show}>
        <div className={styles.subTablContainer}>
          {
            allCategoryBudget &&
            Object.keys(allCategoryBudget).sort().map((category, index) => (
              <div key={category + index + 'budget'}>
                <BudgetSubItem detail={props.result} category={category} categoryBudget={allCategoryBudget[category]} />
              </div>
            ))
          }
        </div>
      </Collapse>
    </>
  );
}