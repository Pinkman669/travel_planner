import { Collapse } from 'react-bootstrap';
import styles from '../../css/Expense.module.css';
import { ExpenseSubItem } from './ExpenseSubItem';

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
                        Object.keys(allCategoryExpense).sort().map((category, index) => (
                            <div key={category + index + 'expense'}>
                                <ExpenseSubItem detail={props.result} category={category} categoryExpense={allCategoryExpense[category]} />
                            </div>
                        ))
                    }
                </div>
            </Collapse>
        </>
    );
}