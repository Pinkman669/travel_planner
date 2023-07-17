import { useLoadScript} from "@react-google-maps/api";
import { GoogleRoute } from "./GoogleRoute";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";

type Libraries = ("drawing" | "geometry" | "localContext" | "places")[];
const libraries: Libraries = ['places']

export default function EventRoute() {
    const [showRoute, setShowRoute] = useState(true)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
        libraries : libraries,
    });

    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const eventsByDay = useAppSelector(state => state.new_event.new_eventItems)[selectedDay as string]

    return (
        <div className="trip-container">
            <div className="control-container">
                {
                    isLoaded && showRoute && selectedDay && eventsByDay.length > 1 ? 
                    <GoogleRoute eventList={eventsByDay}/> :
                    <div>Not Enough Info</div>
                }
            </div>
        </div>
    );
}
