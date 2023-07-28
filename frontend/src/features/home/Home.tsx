import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../auth/AuthSlice";
import styles from "../../css/Home-and-itsModal.module.css"
import { IconPlus, IconX } from "@tabler/icons-react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addTrip, removeTrip } from "./AddTripAPI";
import { notify } from "../utils/utils";
import TripItem from './TripItem'
import { useMutation } from "@tanstack/react-query";
import { differenceInDays } from 'date-fns'
import '../../css/Custom-BS.css'
import { useNavigate } from "react-router-dom";
import { fetchTripItemByUserId } from "./tripSlice";

interface FormState {
    tripName: string;
    numberOfDays: number | null;
    startDate: Date;
    location: string;
}

export default function Home() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const username = useAppSelector(state => state.auth.name)
    const userId = useAppSelector(state => state.auth.userId)
    const isLargeScreen = window.innerWidth  > 450

    useEffect(() => {
        dispatch(fetchTripItemByUserId({ userId: userId as number }))
    }, [dispatch, userId])

    const tripItemInfo = useAppSelector(state => state.trip.tripItems)

    const [showModal, setShowModal] = useState(false)
    // const [startDate, setStartDate] = useState<Date | null>(null)
    const { register, handleSubmit, reset, formState } = useForm<FormState>({
        defaultValues: {
            tripName: "",
            startDate: new Date(),
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
            tripName: data.tripName, startDate: data.startDate, userId: userId as number
        })
    }

    // useCallback
    function calculatePeriod(startDate: Date, endDate: Date) {
        const result = differenceInDays(startDate, endDate)
        return result
    }

    // const toggleModal = useCallback(() => setShowModal(!showModal), [showModal])

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
                    isLargeScreen && <div className={styles.addTripItems}>
                        <button onClick={() => setShowModal(true)} className={styles.addTripBtn}>
                            <IconPlus />
                        </button>
                    </div>
                }
            </div>

            {
                !isLargeScreen && <div className={styles.addTripItems}>
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

                            <Form.Group>
                                <Form.Label className='login-labels'>StartDate</Form.Label>
                                <Form.Control className={styles.addTripInputs} type="date" {...register("startDate")} />
                            </Form.Group>

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