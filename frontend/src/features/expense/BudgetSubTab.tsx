import { Collapse } from 'react-bootstrap';
import styles from '../../css/Expense.module.css';

export interface subTabProps {
  isShown: boolean;
  result: { name: string; category: string; budget: number; expense: number }[];
  allCategoryBudget: {
    [key: string]: number
  };
  onHide: () => void;
}

// export interface subTabDetail {
//   name: string;
//   category: string;
//   budget: number;
//   expense: number;
// }

export function BudgetSubTab(props: subTabProps) {
  const show = props.isShown;
  const detail = props.result;
  const allCategoryBudget = props.allCategoryBudget

  return (
    <>
      <Collapse in={show}>
        <div className={styles.subTablContainer}>
          {
            allCategoryBudget &&
            Object.keys(allCategoryBudget).sort().map((category) => (
              <div>
                <div className={styles.subTab}>
                  <div> {category} </div>
                  <div>${allCategoryBudget[category]}</div>
                </div>
              </div>
            ))
          }
        </div>
      </Collapse>
    </>
  );
}