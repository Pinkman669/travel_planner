import React, { useState } from "react";
import styles from "../../css/Home-and-itsModal.module.css"
import { IconTrashXFilled } from "@tabler/icons-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { format } from "date-fns";

export interface TripItemProps {
    tripName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    onRemove: () => void;
    onClickTrip: () => void
}

export default function TripItem(props: TripItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const handleOpen = () => setShowDeleteModal(true)
    const handleClose = () => setShowDeleteModal(false)

    return (
        <div className={`${styles.tripItems}`}>
            <button className={`${styles.iconBtn} ${styles.tripDeleteBtn}`} onClick={handleOpen}><IconTrashXFilled /></button>
            <div>
                <div>
                    <span className={styles.contentName}>Trip: </span>
                    <span className={styles.content}> {props.tripName}</span>
                </div>
                <div>
                    <span className={styles.contentName}>location: </span>
                    <span className={styles.content}> {props.location}</span>
                </div>
                <div>
                    <span className={styles.contentName}>Start at:</span>
                    <span className={styles.content}> {format(props.startDate, 'dd-MM-yyyy')}</span>
                </div>
            </div>
            <DeleteConfirmModal onRemove={props.onRemove} showModal={showDeleteModal} setShowModal={handleClose} tripName={props.tripName} />
            <button className={styles.detailBtn} onClick={props.onClickTrip}></button>
        </div>
    )
}