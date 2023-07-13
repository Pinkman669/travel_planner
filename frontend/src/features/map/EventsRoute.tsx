import { useLoadScript } from "@react-google-maps/api";
import { GoogleRoute } from "./GoogleRoute";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { select_day_trip } from "../event/daySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function EventRoute() {
    const dispatch = useAppDispatch()
    const [showRoute, setShowRoute] = useState(false)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
        libraries: ['places'],
    });

    useEffect(() =>{ // Temporarily set selected day trip
        dispatch(select_day_trip('day1'))
    }, [])

    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const eventsByDay = useAppSelector(state => state.new_event.new_eventItems)[selectedDay as string]

    console.log(eventsByDay)
    return (
        <div className="trip-container">
            <div className="control-container">
                {
                    // !showRoute && 
                    <Button variant="dark" onClick={() => setShowRoute(true)}>Show Route</Button>
                }
                {
                    isLoaded && showRoute &&<GoogleRoute eventList={eventsByDay}/>
                }
            </div>
        </div>
    );
}
