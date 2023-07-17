import { useLoadScript} from "@react-google-maps/api";
import { GoogleRoute } from "./GoogleRoute";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";


export default function EventRoute() {
    const [showRoute, setShowRoute] = useState(true)

    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const eventsByDay = useAppSelector(state => state.new_event.new_eventItems)[selectedDay as string]

    return (
        <div>
                {
                    showRoute && selectedDay && eventsByDay.length > 1 ? 
                    <GoogleRoute eventList={eventsByDay}/> :
                    <div>Not Enough Info</div>
                }
        </div>
    );
}
