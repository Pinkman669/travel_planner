import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import "../../css/googleMap.css";
import { EventItem } from "../utils/types";
import { Button } from "react-bootstrap";
import getGoogleRoute from "./routeAPI";
import { notify } from "../utils/utils";
import RouteInfo from "./RouteInfo";


type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type DirectionsResponse = google.maps.DirectionsResult

interface GoogleRouteProps {
    eventList: EventItem[]
}

export function GoogleRoute(props: GoogleRouteProps) {
    const directionService = new google.maps.DirectionsService()
    const dispatch = useAppDispatch()

    const [directionResponse, setDirectionResponse] = useState<DirectionsResponse | null>(null)

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

    async function handleGetRoute() {
        setDirectionResponse(null)
        const travelMode = google.maps.TravelMode.DRIVING
        const res = await getGoogleRoute(
            directionService,
            'ChIJ2_UmUkxNekgRqmv-BDgUvtk',
            'ChIJdd4hrwug2EcRmSrV3Vo6llI',
            [{
                location:{
                    placeId: 'ChIJc3FBGy2UcEgRmHnurvD-gco'
                } 
            }],
            travelMode
        )
        if (res) {
            setDirectionResponse(res)
            console.log(JSON.stringify(res, null, 4))
        } else {
            notify(false, 'Get Route error')
        }
    }

    if (process.env.REACT_APP_MAP_DISPLAY === "1") {

        return (
            <div className="search-page">
                <Button variant="dark" onClick={handleGetRoute}>Get Route</Button>
                <GoogleMap
                    zoom={13}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}
                >
                    {location && <Marker position={location} />}
                    {directionResponse && <DirectionsRenderer directions={directionResponse} />}
                </GoogleMap>
                {/* {directionResponse && <RouteInfo />} */}
            </div>
        );
    } else {
        return <div>Map display off</div>;
    }
}