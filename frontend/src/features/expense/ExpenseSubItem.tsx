import React, { useState } from 'react'
import styles from '../../css/Expense.module.css'
import { Collapse } from 'react-bootstrap';
import { ExpenseItem } from '../utils/types';

interface BudgetSubItemProps {
    category: string;
    detail: ExpenseItem[];
    categoryExpense: number;
}

export function ExpenseSubItem(props: BudgetSubItemProps) {
    const [showSubItem, setShowSubItem] = useState(false)
    const isClickedTab = showSubItem ? styles.isClickedTab : null

    return (
        <>  
            <div className={`${styles.subTab} ${isClickedTab}`} onClick={()=>setShowSubItem(!showSubItem)}>
                <div>{props.category}</div>
                <div>${props.categoryExpense}</div>
            </div>
            <Collapse in={showSubItem}>
                <div className={styles.subItemTotalContainer}>
                    {
                        props.detail.map((item, index) => (
                            props.category === item.category &&
                            <div key={item.name + index} className={styles.subItemContainer}>
                                <div>{item.name}</div>
                                <div>${item.expense || 0}</div>
                            </div>
                            ||
                            props.category === 'others' && (!item.category || item.category === 'others') &&
                            <div key={item.name + index} className={styles.subItemContainer}>
                                <div>{item.name}</div>
                                <div>${item.expense || 0}</div>
                            </div>
                        ))
                    }
                </div>
            </Collapse>
        </>
    )
}