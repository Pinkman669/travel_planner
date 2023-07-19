import { GoogleRoute } from "./GoogleRoute";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import styles from '../../css/EventsRoute.module.css'


export default function EventRoute() {

    const selectedDay = useAppSelector(state => state.day.selected_day_trip)
    const eventsByDay = useAppSelector(state => state.new_event.new_eventItems)[selectedDay as string]

    return (
        <div>
                {
                    selectedDay && eventsByDay.length > 1 ? 
                    <GoogleRoute eventList={eventsByDay}/> :
                    <div id={styles.routeDisplayOffContainer}>
                        <div id={styles.routeDisplayOffMsg}>At least Two events is required to be in a single day</div>
                    </div>
                }
        </div>
    );
}
