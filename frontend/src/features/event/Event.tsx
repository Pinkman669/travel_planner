import React from "react";
import styles from '../../css/Event.module.css'

export default function Event() {
    return (
        <div className={styles.eventItemContainer}>
            <div>Event name</div>
            <div>Location</div>
        </div>
    )
}