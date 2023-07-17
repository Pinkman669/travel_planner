import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { EventItem } from '../utils/types';

interface EventDetailProps{
    show: boolean;
    eventItem: EventItem
    onClose: () => void;
}

export default function EventDetail(props: EventDetailProps) {
    const eventItem = props.eventItem

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
                <h4>Centered Modal</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}