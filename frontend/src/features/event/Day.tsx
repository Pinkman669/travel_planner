import React from "react";
import styles from '../../css/Day.module.css'

interface dayItemProps{
    date: Date;
    dayNumber: number;
}

export default function Day(){
    return (
        <div className={styles.dayContainer}>
            <div className={styles.dayHeader}>
                <div>Day 1</div>
                <div>Jun 27, 23</div>
            </div>
            <div className={styles.eventContainer}>
                
            </div>
        </div>
    )
}