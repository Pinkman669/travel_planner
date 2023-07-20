import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { EventItem } from '../utils/types';
import { format } from 'date-fns'
import styles from '../../css/EventDetail.module.css'
import { IconEdit, IconTrashXFilled } from '@tabler/icons-react';
import DeleteEventModal from './DeleteEventModal';
import { removeEvent } from './EventAPI';
import { useMutation } from '@tanstack/react-query';
import { notify } from '../utils/utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchEventByTrip } from './newEventSlice';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
// import { getTime } from 'date-fns'

interface EventDetailProps {
    show: boolean;
    eventItem: EventItem
    onClose: () => void;
}

interface FormState {
    date: Date;
    time: string;
    budget: number;
    category: string;
}

export default function EventDetail(props: EventDetailProps) {
    const dispatch = useAppDispatch()
    const { tripId } = useParams()
    const datesOfTrip = useAppSelector(state => state.trip.tripItems).find(trip => trip.id === Number(tripId))?.DatesOfTrip
    const eventItem = props.eventItem

    const { register, handleSubmit } = useForm<FormState>({
        defaultValues: {
            date: eventItem.date,
            time: eventItem.time,
            budget: eventItem.budget,
            category: eventItem.category
        },
    });


    const regex = /["'{},]+/gi

    let clearBusinessHrs: string[] | []
    if (eventItem.business_hours) {
        clearBusinessHrs = (eventItem.business_hours as string).split(regex)
    } else {
        clearBusinessHrs = []
    }

    const [showDeleteEvent, setShowDeleteEvent] = useState(false)
    const handleOpen = () => setShowDeleteEvent(true)
    const handleClose = () => setShowDeleteEvent(false)

    const onRemoveEvent = useMutation(
        async (data: { eventId: number, eventName: string }) => {
            return await removeEvent(data.eventId)
        },
        {
            onSuccess: (success, data) => {
                notify(true, `Removed Event ${data.eventName}`)
            },
            onError: () => {
                notify(false, 'Event remove failed')
            },
            onSettled: () => dispatch(fetchEventByTrip({ tripId: Number(tripId), datesOfTrip: datesOfTrip || [] }))
        }
    )
    function handleRemoveEvent() {
        onRemoveEvent.mutate({ eventId: eventItem.id, eventName: eventItem.name })
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
                    <Form id={styles.evenDetailForm} onSubmit={() => []}>
                        <div className={styles.eventDetailField}>
                            <div className={styles.eventDetailTitle}>Date: </div>
                            <DatePicker value={new Date(eventItem.date)} className={styles.eventDetailDate} />
                            {/* <DatePicker className={styles.addTripDate} value={startDate} onChange={(newDate) => { setStartDate(newDate) }} label='Start Date' /> */}
                        </div>

                        <div className={styles.eventDetailField}>
                            <div className={styles.eventDetailTitle}>Time: </div>
                            <TimePicker className={styles.eventDetailTime} />
                        </div>

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

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label>Phone No. : </Form.Label>
                            <Form.Control type='text' placeholder={eventItem.phone}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label>WebSite: </Form.Label>
                            <Form.Control type='text' placeholder={eventItem.website}></Form.Control>
                                {/* <a href={eventItem.website} rel="noreferrer noopener" target="_blank">
                                    {
                                        eventItem.website.length > 100 ? `${eventItem.website.slice(0, 100)}...` : eventItem.website
                                    }
                                </a> */}
                        </Form.Group>
                        
                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label>Budget: $</Form.Label>
                            <Form.Control type='number' placeholder={eventItem.budget+''}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label>Expense: $</Form.Label>
                            <Form.Control type='number' placeholder={eventItem.expense ? eventItem.expense+'' : '0'}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label>category: </Form.Label>
                            <Form.Control type='text' placeholder={eventItem.category}></Form.Control>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button onClick={() => []} variant='info'>
                            <div>
                                <IconEdit />
                                <span>Save</span>
                            </div>
                        </Button>
                    </div>
                    <div>
                        <Button onClick={handleOpen} variant='warning'>
                            <div>
                                <IconTrashXFilled />
                                <span>Delete</span>
                            </div>
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <DeleteEventModal show={showDeleteEvent} onClose={handleClose} onRemove={handleRemoveEvent} itemName={eventItem.name} />
        </>
    );
}