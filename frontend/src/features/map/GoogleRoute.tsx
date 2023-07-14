import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import "../../css/GoogleMap.css";
// import styles from '../../css/GoogleRoute.module.css'
import { EventItem } from "../utils/types";
import { Button } from "react-bootstrap";
import getGoogleRoute from "./routeAPI";
import { notify } from "../utils/utils";
import RouteInfo from "./RouteInfo";


type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type DirectionsResponse = google.maps.DirectionsResult
type DirectionsWayPoint = google.maps.DirectionsWaypoint

interface GoogleRouteProps {
    eventList: EventItem[]
}

export function GoogleRoute(props: GoogleRouteProps) {
    const evenList = props.eventList

    const directionService = new google.maps.DirectionsService()
    const [directionResponse, setDirectionResponse] = useState<DirectionsResponse | null>(null)

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
            clickableIcons: false,
            streetViewControl: false,
            mapTypeControl: false
        }),
        []
    );
    const startPointId = evenList[0].place_id
    const endPointId = evenList[evenList.length-1].place_id
    const WayPointArr: DirectionsWayPoint[] = []
    if (evenList.length > 2){
        createWayPointArr()
    }
    function createWayPointArr(){
        const wayPointList = evenList.slice(1, evenList.length-1)
        wayPointList.forEach((event) => {
            WayPointArr.push({
                location: {
                    placeId: event.place_id
                }
            })
        })
    }

    async function handleGetRoute(startPointId: string, endPointId: string, wayPointArr: DirectionsWayPoint[]) {
        setDirectionResponse(null)
        const travelMode = google.maps.TravelMode.DRIVING
        const res = await getGoogleRoute(
            directionService,
            startPointId,
            endPointId,
            wayPointArr,
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
            <>
                <div className="search-page">
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
                    <Button variant="dark" onClick={() => handleGetRoute(startPointId, endPointId, WayPointArr)}>Get Route</Button>
                    {directionResponse && <RouteInfo travelMode="driving" directionResponse={directionResponse}/>}
                </div>
            </>
        );
    } else {
        return <div>Map display off</div>;
    }
}