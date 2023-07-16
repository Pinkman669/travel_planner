import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import "../../css/GoogleMap.css";
import styles from '../../css/GoogleRoute.module.css'
import { EventItem } from "../utils/types";
import getGoogleRoute from "./routeAPI";
import { notify } from "../utils/utils";
import RouteInfo from "./RouteInfo";
import RouteForm, { RouteFormState } from "./RouteForm";
import { Button, CloseButton } from "react-bootstrap";
import { IconTableOptions } from "@tabler/icons-react";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type DirectionsResponse = google.maps.DirectionsResult
type DirectionsWayPoint = google.maps.DirectionsWaypoint
type TravelMode = google.maps.TravelMode

interface GoogleRouteProps {
    eventList: EventItem[]
}

export function GoogleRoute(props: GoogleRouteProps) {
    const evenList = props.eventList

    const directionService = new google.maps.DirectionsService()
    const [directionResponse, setDirectionResponse] = useState<DirectionsResponse | null>(null)

    const [travelModeValue, setTravelModeValue] = useState<any | null>(null)
    const [location, setLocation] = useState<LatLngLiteral>();
    const [animation, setAnimation] = useState(false)
    const [showRouteForm, setShowRouteForm] = useState(true);
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
    const endPointId = evenList[evenList.length - 1].place_id
    const WayPointArr: DirectionsWayPoint[] = []
    if (evenList.length > 2) {
        createWayPointArr()
    }
    function createWayPointArr() {
        const wayPointList = evenList.slice(1, evenList.length - 1)
        wayPointList.forEach((event) => {
            WayPointArr.push({
                location: {
                    placeId: event.place_id
                }
            })
        })
    }

    function handleFormSubmit(data: RouteFormState) {
        handleGetRoute(startPointId, endPointId, WayPointArr, data.travelMode as TravelMode)
        handleClose()
    }

    async function handleGetRoute(
        startPointId: string,
        endPointId: string,
        wayPointArr: DirectionsWayPoint[],
        travelModeValue: TravelMode
    ) {
        setDirectionResponse(null)
        const res = await getGoogleRoute(
            directionService,
            startPointId,
            endPointId,
            wayPointArr,
            travelModeValue
        )
        if (res) {
            setTravelModeValue(travelModeValue)
            setDirectionResponse(res)
        } else {
            notify(false, 'Get Route error')
        }
    }

    const handleClose = async () => {
        setAnimation(true)
        await new Promise(r => setTimeout(r, 100))
        setAnimation(false)
        setShowRouteForm(false)
    };
    const handleShow = async () => {
        if (!showRouteForm) {
            setShowRouteForm((prev) => !prev)
        } else {
            handleClose()
        }
    }

    if (process.env.REACT_APP_MAP_DISPLAY === "1") {

        return (
            <>
                <div className="search-page">
                    <Button variant="dark" onClick={handleShow} className={styles.showRouteFromBtn}>
                        <IconTableOptions />
                    </Button>
                    {
                        // showRouteForm &&
                        <div className={`${styles.RouteFormOverlay} ${showRouteForm ? styles.open : styles.close} ${animation ? styles.closing : null}`}>
                            <CloseButton variant='white' onClick={handleClose} className={styles.closeRouteFormBtn} />
                            <div className={styles.RouteFormContainer}>
                                <RouteForm onSubmit={handleFormSubmit}></RouteForm>
                            </div>
                        </div>
                    }

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
                    {directionResponse && <RouteInfo travelMode={travelModeValue} directionResponse={directionResponse} />}

                </div>
            </>
        );
    } else {
        return <div>Map display off</div>;
    }
}