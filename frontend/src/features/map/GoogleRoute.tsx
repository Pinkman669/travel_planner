import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from '../../css/GoogleRoute.module.css'
import { EventItem } from "../utils/types";
import { getGoogleRoute, getGoogleRouteTransit } from "./routeAPI";
import { notify } from "../utils/utils";
import RouteInfo from "./RouteInfo";
import RouteForm, { RouteFormState } from "./RouteForm";
import { Button, CloseButton } from "react-bootstrap";
import { IconInfoSquareFilled, IconTableOptions } from "@tabler/icons-react";

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
    const [showRouteInfo, setShowRouteInfo] = useState(false)
    const [showOverlay, setShowOverlay] = useState(true)
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

    function createWayPointArr(inputEventList: EventItem[]) {
        const wayPointArr: DirectionsWayPoint[] = []
        const wayPointList = inputEventList.slice(1, inputEventList.length - 1)
        wayPointList.forEach((event) => {
            wayPointArr.push({
                location: {
                    placeId: event.place_id
                }
            })
        })
        return wayPointArr
    }

    function handleFormSubmit(data: RouteFormState) {
        const startPointId = evenList[0].place_id
        const endPointId = evenList[evenList.length - 1].place_id
        let WayPointArr: DirectionsWayPoint[] = []
        if (evenList.length > 2) {
            WayPointArr = createWayPointArr(evenList)
        }
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
        if (travelModeValue !== 'TRANSIT') {
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
                setShowOverlay(true)
                setShowRouteForm(false)
                setShowRouteInfo(true)
            } else {
                notify(false, 'Get Route error')
            }
        } else {
            const res = await getGoogleRouteTransit(
                directionService,
                startPointId,
                endPointId,
                travelModeValue
            )
            if (res) {
                setTravelModeValue(travelModeValue)
                setDirectionResponse(res)
                setShowOverlay(true)
                setShowRouteForm(false)
                setShowRouteInfo(true)
                console.log(JSON.stringify(res, null, 4))
            } else {
                notify(false, 'Get Route error')
            }
        }
    }

    const handleClose = async () => {
        setAnimation(true)
        await new Promise(r => setTimeout(r, 100))
        setAnimation(false)
        setShowOverlay(false)
    };
    const handleShowRouteFrom = () => {
        setShowOverlay(true)
        setShowRouteForm(true)
        setShowRouteInfo(false)
    }

    const handleShowRouteInfo = () => {
        if (directionResponse) {
            setShowOverlay(true)
            setShowRouteInfo(true)
            setShowRouteForm(false)
        }
    }

    if (process.env.REACT_APP_MAP_DISPLAY === "1") {

        return (
            <>
                <div className={styles.searchPage}>
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
                    <div className={
                        `${styles.RouteFormOverlay} 
                        ${showOverlay ? styles.open : styles.close} 
                        ${animation ? styles.closing : null}
                        ${showRouteForm ? styles.RouteFormOverlayColour : styles.RouteInfoOverlayColour}`
                    }>
                        <button onClick={handleShowRouteFrom} className={styles.showRouteFromBtn}>
                            <IconTableOptions />
                        </button>
                        <button onClick={handleShowRouteInfo} className={styles.showRouteInfoBtn}>
                            <IconInfoSquareFilled />
                        </button>
                        <CloseButton variant='white' onClick={handleClose} className={styles.closeRouteFormBtn} />
                        {
                            showRouteInfo && directionResponse ?
                                <RouteInfo travelMode={travelModeValue} directionResponse={directionResponse}/> :
                                null
                        }
                        {showRouteForm && <div className={`${styles.RouteFormContainer} ${showRouteForm ? null : styles.closeForm}`}>
                            <RouteForm onSubmit={handleFormSubmit}></RouteForm>
                        </div>}
                    </div>
                </div>
            </>
        );
    } else {
        return <div>Map display off</div>;
    }
}