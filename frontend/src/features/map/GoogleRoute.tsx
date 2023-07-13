import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { select_day_trip } from "../event/daySlice";
import "../../css/googleMap.css";
import { EventItem } from "../utils/types";

type LatLngLiteral = google.maps.LatLngLiteral;

type MapOptions = google.maps.MapOptions;

interface GoogleRouteProps{
    eventList: EventItem[]
}

export function GoogleRoute(props: GoogleRouteProps) {
    const dispatch = useAppDispatch()

    // useEffect(() =>{ // Temporarily set selected day trip
    //     dispatch(select_day_trip('day1'))
    // }, [])
    // const selectedDay = useAppSelector(state => state.day.selected_day_trip)

    const [location, setLocation] = useState<LatLngLiteral>();
    const mapRef = useRef<google.maps.Map>();
    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);
    const center = useMemo<LatLngLiteral>(
        () => ({ lat: 43.4722893, lng: -80.5474325 }),
        []
    );
    const options = useMemo<MapOptions>(
        () => ({
            mapId: "cb967ffe6985ef4e", // the style of the map
            //   disableDefaultUI: true, // the option to change the view of the map, it's set to street view right now
            clickableIcons: false, // the option to click on the icons that shows up on the map
            streetViewControl: false,
            mapTypeControl: false
        }),
        []
    );

    if (process.env.REACT_APP_MAP_DISPLAY === "1") {

        return (
            <div className="search-page">
                <GoogleMap
                    zoom={13}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}
                >
                    {location && <Marker position={location} />}

                </GoogleMap>
            </div>
        );
    } else {
        return <div>Map display off</div>;
    }
}