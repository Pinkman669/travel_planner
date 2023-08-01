import { Collapse } from 'react-bootstrap';
import styles from '../../css/Expense.module.css';

export interface subTabProps {
    isShown: boolean;
    result: { name: string; category: string; budget: number; expense: number }[];
    allCategoryExpense: {
        [key: string]: number
    }
    onHide: () => void;
}

export function ExpenseSubTab(props: subTabProps) {
    const show = props.isShown;
    const allCategoryExpense = props.allCategoryExpense

    return (
        <>
            <Collapse in={show}>
                <div className={styles.subTablContainer}>
                    {
                        allCategoryExpense &&
                        Object.keys(allCategoryExpense).sort().map((category) => (
                            <div>
                                <div className={styles.subTab}>
                                    <div> {category} </div>
                                    <div>${allCategoryExpense[category]}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Collapse>
        </>
    );
}