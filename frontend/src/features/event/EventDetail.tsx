import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { EventItem } from '../utils/types';
import styles from '../../css/EventDetail.module.css'
import { IconEdit, IconTrashXFilled } from '@tabler/icons-react';
import DeleteEventModal from './DeleteEventModal';
import { removeEvent, updateEventInfo } from './EventAPI';
import { useMutation } from '@tanstack/react-query';
import { notify } from '../utils/utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchEventByTrip } from './newEventSlice';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';


interface EventDetailProps {
    show: boolean;
    eventItem: EventItem
    onClose: () => void;
}

interface FormState {
    time: string;
    date: Date | string;
    budget: number;
    category: string;
    expense: number;
    website: string;
    phone: string;
    name: string;
}

export default function EventDetail(props: EventDetailProps) {
    const eventItem = props.eventItem
    const { tripId } = useParams()
    const dispatch = useAppDispatch()
    const datesOfTrip = useAppSelector(state => state.trip.tripItems).find(trip => trip.id === Number(tripId))?.DatesOfTrip
    const [editMode, setEditMode] = useState(false)
    const formatedEventDate = format(new Date(eventItem.date), 'yyyy-MM-dd')
    const formatedStartDate = format(new Date(datesOfTrip![0]), 'yyyy-MM-dd')
    const formatedEndDate = format(new Date(datesOfTrip![datesOfTrip!.length - 1]), 'yyyy-MM-dd')

    const { register, handleSubmit } = useForm<FormState>({
        defaultValues: {
            time: eventItem.time,
            date: formatedEventDate,
            budget: eventItem.budget,
            category: eventItem.category,
            website: eventItem.website,
            phone: eventItem.phone,
            name: eventItem.name,
            expense: eventItem.expense
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
    // onModalOpen / onModalClose
    const handleOpen = () => setShowDeleteEvent(true)
    const handleClose = () => setShowDeleteEvent(false)

    const onSubmitEventUpdate = useMutation(
        async (data: { eventUpdateInfo: FormState, newDate: Date, eventId: number }) => {
            return await updateEventInfo(data.eventUpdateInfo, data.newDate, data.eventId)
        },
        {
            onSuccess: (success, data) => {
                notify(true, `Event ${data.eventUpdateInfo.name} updated`)
            },
            onError: () => {
                notify(false, `Event update failed`)
            },
            onSettled: () => dispatch(fetchEventByTrip({ tripId: Number(tripId) }))
        }
    )

    function submit(data: FormState) {
        const formatedNewDate = format(new Date(data.date), 'yyyy-MM-dd')
        if (formatedNewDate < formatedStartDate || formatedNewDate > formatedEndDate) {
            notify(false, 'Date out of bound')
        } else {
            onSubmitEventUpdate.mutate({ eventUpdateInfo: data, newDate: data.date as Date, eventId: eventItem.id })
            setEditMode(false)
        }
    }

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
            onSettled: () => dispatch(fetchEventByTrip({ tripId: Number(tripId) }))
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
                        <Form id='evenDetailForm' onSubmit={handleSubmit(submit)}>
                            <Form.Control className={`${styles.eventDetailInput} ${styles.eventName}`} type='text' placeholder={eventItem.name} {...register('name')} disabled={!editMode}></Form.Control>
                        </Form>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.eventAddressContainer}>
                        <div className={styles.eventDetailTitle}>Address: </div>
                        <div className={styles.eventDetailInput}>{eventItem.location}</div>
                    </div>
                    <Form id='evenDetailForm'>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>Date : </Form.Label>
                            <Form.Control className={styles.eventDetailInput} disabled={!editMode} type='date' {...register('date')}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>Time : </Form.Label>
                            <Form.Control className={styles.eventDetailInput} disabled={!editMode} type='text' placeholder={eventItem.time} {...register('time')}></Form.Control>
                        </Form.Group>

                        <div>
                            <div className={styles.eventDetailTitle}>
                                Business Hours:
                            </div>
                            <ul>
                                {
                                    clearBusinessHrs.map((item) => {
                                        if (item.length) {
                                            return <li className={styles.businessHourContent} key={eventItem.id + item}>{item}</li>
                                        }
                                        return null
                                    })
                                }
                            </ul>
                        </div>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>Phone No. : </Form.Label>
                            <Form.Control className={styles.eventDetailInput} disabled={!editMode} type='text' placeholder={eventItem.phone} {...register('phone')}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>WebSite: </Form.Label>
                            {
                                editMode ?
                                    <Form.Control type='text' placeholder={eventItem.website} {...register('website')}></Form.Control>
                                    :
                                    <a className={styles.eventWebsite} href={eventItem.website} rel="noreferrer noopener" target="_blank">
                                        {
                                            eventItem.website.length > 100 ? `${eventItem.website.slice(0, 100)}...` : eventItem.website
                                        }
                                    </a>
                            }
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>Budget: $</Form.Label>
                            <Form.Control className={styles.eventDetailInput} disabled={!editMode} type='number' placeholder={eventItem.budget + ''} {...register('budget')}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>Expense: $</Form.Label>
                            <Form.Control className={styles.eventDetailInput} disabled={!editMode} type='number' placeholder={eventItem.expense ? eventItem.expense + '' : '0'} {...register('expense')}></Form.Control>
                        </Form.Group>

                        <Form.Group className={styles.eventDetailField}>
                            <Form.Label className={styles.eventDetailTitle}>category: </Form.Label>
                            <Form.Control className={styles.eventDetailInput} disabled={!editMode} type='text' placeholder={eventItem.category} {...register('category')}></Form.Control>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    {
                        editMode &&
                        <div>
                            <Button form='evenDetailForm' type='submit' variant='info'>
                                <div>
                                    <IconEdit />
                                    <span>Save</span>
                                </div>
                            </Button>
                        </div>
                    }
                    {
                        !editMode &&
                        <div>
                            <Button variant='info' onClick={() => setEditMode(true)}>
                                <div>
                                    <IconEdit />
                                    <span>Edit</span>
                                </div>
                            </Button>
                        </div>
                    }
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