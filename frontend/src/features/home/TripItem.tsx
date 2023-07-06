import React from "react";
import styles from "../../css/Common.module.css"

export interface TripItemProps{
    tripName: string;
    location: string;
    onRemove: () => void;
    period: number;
}

export default function TripItem(props: TripItemProps){
    return (
        <div className={styles.addTripItems}>
            <button onClick={props.onRemove}>Remove</button>
            <div>Trip: {props.tripName}</div>
            <div>location: {props.location}</div>
            <div>period: {props.period}</div>
        </div>
    )
}