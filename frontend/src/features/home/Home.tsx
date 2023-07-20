import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../auth/AuthSlice";
import styles from "../../css/Home-and-itsModal.module.css"
import { IconPlus, IconX } from "@tabler/icons-react";
import { Button, Form, Modal } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { addTrip, removeTrip } from "./AddTripAPI";
import { notify } from "../utils/utils";
import TripItem from './TripItem'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { differenceInDays } from 'date-fns'
import '../../css/Custom-BS.css'
import { useNavigate } from "react-router-dom";
import { fetchTripItemByUserId } from "./tripSlice";

interface FormState {
    tripName: string;
    numberOfDays: number | null;
    location: string;
}

export default function Home() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    const username = useAppSelector(state => state.auth.name)
    const userId = useAppSelector(state => state.auth.userId)
    const screenWidth = window.innerWidth

    useEffect(() => {
        dispatch(fetchTripItemByUserId({ userId: userId as number }))
    }, [dispatch, userId])

    const tripItemInfo = useAppSelector(state => state.trip.tripItems)

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
            onError: () => {
                notify(false, 'Add trip failed')
            },
            onSettled: () => dispatch(fetchTripItemByUserId({ userId: userId as number }))
        }
    )

    const onRemoveTrip = useMutation(
        async (data: { tripId: number, tripName: string }) => {
            return await removeTrip(data.tripId)
        },
        {
            onSuccess: (success, data) => {
                queryClient.invalidateQueries(['tripItems'])
                notify(true, `Removed Trip ${data.tripName}`)
            },
            onError: () => {
                notify(false, 'Trip remove failed')
            },
            onSettled: () => dispatch(fetchTripItemByUserId({ userId: userId as number }))
        }
    )

    async function submit(data: FormState) {
        onSubmit.mutate({
            location: data.location, numberOfDays: data.numberOfDays as number,
            tripName: data.tripName, startDate: startDate as Date, userId: userId as number
        })
    }

    function calculatePeriod(startDate: Date, endDate: Date) {
        const result = differenceInDays(startDate, endDate)
        return result
    }

    const handleModal = () => {
        if (showModal) {
            setShowModal(false)
        } else {
            setShowModal(true)
        }
    }

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset(formState.defaultValues)
            setShowModal(false)
            setStartDate(null)
        }
    }, [formState, reset])

    return (
        <div className="container-fluid">

            <div className={styles.tripHeader}>
                <p id={styles.username}>{username}</p>
                <Button variant="light" onClick={() => dispatch(logout())}>Logout</Button>
            </div>
            <div className={styles.mainContainer}>
                {
                    tripItemInfo.map((item) => (
                        <TripItem
                            onRemove={() => {
                                onRemoveTrip.mutate({ tripId: item.id, tripName: item.name })
                            }}
                            onClickTrip={() => navigate(`/trip-event/${item.id}`)}
                            key={item.id} tripName={item.name} location={item.location}
                            period={calculatePeriod(new Date(item.end_date), new Date(item.start_date))}
                        />
                    ))
                }
                {
                    screenWidth > 450 && <div className={styles.addTripItems}>
                        <button onClick={handleModal} className={styles.addTripBtn}>
                            <IconPlus />
                        </button>
                    </div>
                }
            </div>

            {
                screenWidth <= 450 && <div className={styles.addTripItems}>
                    <button onClick={handleModal} className={styles.addTripBtn}>
                        <IconPlus />
                    </button>
                </div>
            }

            {/* modal */}
            <Modal
                show={showModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleModal}
            >
                <div>
                    <button className={styles.iconBtn} onClick={handleModal}><IconX /></button>
                </div>
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

                            <Button className='submit-btn' variant="dark" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}