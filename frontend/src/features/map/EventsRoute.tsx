import { useLoadScript } from "@react-google-maps/api";
import { GoogleRoute } from "./GoogleRoute";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { select_day_trip } from "../event/daySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import RouteInfo from "./RouteInfo";

export default function EventRoute() {
    const dispatch = useAppDispatch()
    const [showRoute, setShowRoute] = useState(false)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
        libraries: ['places'],
    });
    const travelMode = 'driving'

    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const eventsByDay = useAppSelector(state => state.new_event.new_eventItems)[selectedDay as string]
    return (
        <div className="trip-container">
            <div className="control-container">
            <RouteInfo travelMode={travelMode}/>
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
