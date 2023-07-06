import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../auth/AuthSlice";
import styles from "../../css/Common.module.css"
import { IconPlus } from "@tabler/icons-react";
import { Button, Form, Modal } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { addTrip, useTripItems } from "./AddTripAPI";
import { notify } from "../utils/utils";
import TripItem from './TripItem'
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormState {
    tripName: string;
    numberOfDays: number | null;
    location: string;
}

export default function Home() {
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    const username = useAppSelector(state => state.auth.name)
    const userId = useAppSelector(state => state.auth.userId)
    const tripItemInfo = useTripItems(userId as number)

    const [showModal, setShowModal] = useState(false)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const { register, handleSubmit, reset, formState } = useForm<FormState>({
        defaultValues: {
            tripName: "",
            location: '',
            numberOfDays: null
        },
    });

    const onSubmit = useMutation(
        async (data: { location: string, numberOfDays: number, tripName: string, startDate: Date, userId: number }) => {
            return await addTrip(data.location, data.numberOfDays, data.tripName, data.startDate, data.userId)
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(['tripItems'])
                    notify(true, 'Added Trip')
                },
                onError: () =>{
                    notify(false, 'Add trip failed')
                }
            }
        )

    async function submit(data: FormState) {
        console.log(data, startDate)
        if (formState.isSubmitted) {
            onSubmit.mutate({ location: data.location, numberOfDays: data.numberOfDays as number, tripName: data.tripName, startDate: startDate as Date, userId: userId as number })
        }
    }

    async function reMoveTripItem(tripId: number){
        
    }

    const handleModal = () => {
        if (showModal) {
            setShowModal(false)
        } else {
            setShowModal(true)
        }
    }

    return (
        <div className="container-fluid">
            <div className={styles.tripHeader}>
                <p id={styles.username}>{username}</p>
                <Button variant="light" onClick={() => dispatch(logout())}>Logout</Button>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.addTripItems}>
                    <button onClick={handleModal} className={styles.addTripBtn}>
                        <IconPlus />
                    </button>
                </div>
                {
                    tripItemInfo.map((item) => (
                        <TripItem key={item.id} tripName={item.name} location={item.location} period={1} onRemove={()=> reMoveTripItem(item.id)}/>
                    ))
                }
            </div>

            {/* modal */}
            <Modal
                show={showModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Trip Info
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Form id='login-form' onSubmit={handleSubmit(submit)}>
                            <Form.Group>
                                <Form.Label className='login-labels'>Trip</Form.Label>
                                <Form.Control className={styles.addTripInputs} type="text" {...register("tripName")} />
                            </Form.Group>

                            <DatePicker className={styles.addTripDate} value={startDate} onChange={(newDate) => { setStartDate(newDate) }} label='Start Date' />

                            <Form.Group>
                                <Form.Label className='login-labels'>Number of days</Form.Label>
                                <Form.Control className={styles.addTripInputs} type="number" {...register("numberOfDays")} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='login-labels'>Location</Form.Label>
                                <Form.Control className={styles.addTripInputs} type="text" {...register("location")} />
                            </Form.Group>

                            <Button className='submit-btn' variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}