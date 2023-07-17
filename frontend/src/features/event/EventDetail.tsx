import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { EventItem } from '../utils/types';
import { format } from 'date-fns'

interface EventDetailProps{
    show: boolean;
    eventItem: EventItem
    onClose: () => void;
}

export default function EventDetail(props: EventDetailProps) {
    const eventItem = props.eventItem
    const regex = /["'{},]+/gi
    const clearBusinessHrs = eventItem.business_hours.split(regex)

    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.show}
            onHide={props.onClose}
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
                            if (item.length){
                                return <li key={eventItem.id+item}>{item}</li>
                            }
                            return null
                        })
                    }
                    </ul>
                </div>
                <p>Phone No. : {eventItem.phone}</p>
                <p>WebSite: <a href={eventItem.website}>
                    {
                        eventItem.website.length > 100 ? `${eventItem.website.slice(0, 100)}...` : eventItem.website
                    }
                    </a></p>
                <p>Budget: {eventItem.budget}</p>
            </Modal.Body>
        </Modal>
    );
}