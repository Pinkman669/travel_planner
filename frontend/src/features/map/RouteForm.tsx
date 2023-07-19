import React from 'react'
import { Button, Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';


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
            <Form.Select aria-label="Default select example" {...register('travelMode')}>
                <option value={'DRIVING'}>Driving</option>
                <option value={'TRANSIT'}>Transit</option>
                <option value={'WALKING'}>Walking</option>
                <option value={'BICYCLING'}>Bicycling</option>
            </Form.Select>

            <Button className='submit-btn' variant="warning" type="submit">
                Get Route
            </Button>
        </Form>
    )
}