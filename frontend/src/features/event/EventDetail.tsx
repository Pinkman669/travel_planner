import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { EventItem } from '../utils/types';
import { format } from 'date-fns'
import styles from '../../css/EventDetail.module.css'
import { IconTrashXFilled } from '@tabler/icons-react';
import DeleteEventModal from './DeleteEventModal';
import { removeEvent } from './EventAPI';
import { useMutation } from '@tanstack/react-query';
import { notify } from '../utils/utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchEventByTrip } from './newEventSlice';
import { useParams } from 'react-router-dom';

interface EventDetailProps {
    show: boolean;
    eventItem: EventItem
    onClose: () => void;
}

export default function EventDetail(props: EventDetailProps) {
    const dispatch = useAppDispatch()
    const {tripId} = useParams()
    const datesOfTrip = useAppSelector(state => state.trip.tripItems).find(trip => trip.id === Number(tripId))?.DatesOfTrip

    const eventItem = props.eventItem
    const regex = /["'{},]+/gi
    
    let clearBusinessHrs: string[]|[]
    if (eventItem.business_hours){
        clearBusinessHrs = (eventItem.business_hours as string).split(regex)
    } else{
        clearBusinessHrs = []
    }

    const [showDeleteEvent, setShowDeleteEvent] = useState(false)
    const handleOpen = () => setShowDeleteEvent(true)
    const handleClose = () => setShowDeleteEvent(false)

    const onRemoveEvent = useMutation(
        async (data: { eventId: number, eventName: string}) => {
            return await removeEvent(data.eventId)
        },
        {
            onSuccess: (success, data) => {
                notify(true, `Removed Event ${data.eventName}`)
            },
            onError: () => {
                notify(false, 'Event remove failed')
            },
            onSettled: () => dispatch(fetchEventByTrip({tripId: Number(tripId), datesOfTrip: datesOfTrip || []}))
        }
    )
    function handleRemoveEvent(){
        onRemoveEvent.mutate({eventId: eventItem.id, eventName: eventItem.name})
    }

    return (
        <>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={props.show}
                onHide={props.onClose}
                className={styles.eventDetailModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {eventItem.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Address: {eventItem.location}</p>
                    <p>Date: {format(new Date(eventItem.date), 'PPPP')}</p>
                    <p>Time: {eventItem.time}</p>
                    <div>Business Hours:
                        <ul>
                            {
                                clearBusinessHrs.map((item) => {
                                    if (item.length) {
                                        return <li key={eventItem.id + item}>{item}</li>
                                    }
                                    return null
                                })
                            }
                        </ul>
                    </div>
                    <p>Phone No. : {eventItem.phone}</p>
                    <div id={styles.websiteContainer}>
                        <p>WebSite:
                        </p>
                            <a href={eventItem.website} rel="noreferrer noopener" target="_blank">
                                {
                                    eventItem.website.length > 100 ? `${eventItem.website.slice(0, 100)}...` : eventItem.website
                                }
                            </a>
                    </div>
                    <p>Budget: ${eventItem.budget}</p>
                    <button className={`${styles.iconBtn} ${styles.eventDeleteBtn}`} onClick={handleOpen}><IconTrashXFilled /></button>
                </Modal.Body>
            </Modal>
            <DeleteEventModal show={showDeleteEvent} onClose={handleClose} onRemove={handleRemoveEvent} itemName={eventItem.name}/>
        </>
    );
}