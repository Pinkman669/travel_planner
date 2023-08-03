import React from 'react'
import { Button, Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import styles from '../../css/RouteForm.module.css'


export interface RouteFormState {
    travelMode: String
}

// export const travelMode = google.maps.TravelMode

interface RouteFormStateProps{
    onSubmit: (data: RouteFormState) => void
}

export default function RouteForm(props: RouteFormStateProps) {
    const { register, handleSubmit } = useForm<RouteFormState>({
        defaultValues: {
            travelMode: "DRIVING"
        },
    });

    return (
        <Form id='login-form' onSubmit={handleSubmit(props.onSubmit)}>
            <Form.Select className={styles.formOption} aria-label="Default select example" {...register('travelMode')}>
                <option value={'DRIVING'}>Driving</option>
                <option value={'TRANSIT'}>Transit</option>
                <option value={'WALKING'}>Walking</option>
                <option value={'BICYCLING'}>Bicycling</option>
            </Form.Select>

            <Button className={styles.routeSubmitBtn} variant="warning" type="submit">
                Get Route
            </Button>
        </Form>
    )
}