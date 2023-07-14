import { useLoadScript } from "@react-google-maps/api";
import { GoogleRoute } from "./GoogleRoute";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useAppSelector } from "../../redux/hooks";

export default function EventRoute() {
    const [showRoute, setShowRoute] = useState(false)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
        libraries: ['places'],
    });

    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const eventsByDay = useAppSelector(state => state.new_event.new_eventItems)[selectedDay as string]

    return (
        <div className="trip-container">
            <div className="control-container">
                {
                    // !showRoute && 
                    <Button variant="dark" onClick={() => setShowRoute(true)}>Show Route</Button>
                }
                {
                    isLoaded && showRoute && eventsByDay.length > 1 &&<GoogleRoute eventList={eventsByDay}/>
                }
            </div>
        </div>
    );
}
