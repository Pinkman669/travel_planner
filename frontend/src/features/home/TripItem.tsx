import React from "react";
import styles from "../../css/Home-and-itsModal.module.css"
import { IconTrashXFilled } from "@tabler/icons-react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export interface TripItemProps {
    tripName: string;
    location: string;
    showDeleteModal: boolean
    onShowDeleteModal: () => void;
    period: number;
    onRemove: () => void;
    onClickTrip: () => void
}

export default function TripItem(props: TripItemProps) {
    return (
            <div className={`${styles.tripItems}`}>
                <button className={`${styles.iconBtn} ${styles.tripDeleteBtn}`} onClick={props.onShowDeleteModal}><IconTrashXFilled /></button>
                <div>Trip: {props.tripName}</div>
                <div>location: {props.location}</div>
                <div>period: {props.period}</div>
                <DeleteConfirmModal onRemove={props.onRemove} showModal={props.showDeleteModal} setShowModal={props.onShowDeleteModal} tripName={props.tripName} />
                <button className={styles.detailBtn} onClick={props.onClickTrip}></button>
            </div>
    )
}