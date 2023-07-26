import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from '../../css/GoogleRoute.module.css'
import { EventItem } from "../utils/types";
import { getGoogleRoute, getGoogleRouteTransit } from "./routeAPI";
import { notify } from "../utils/utils";
import RouteInfo from "./RouteInfo";
import RouteForm, { RouteFormState } from "./RouteForm";
import { CloseButton } from "react-bootstrap";
import { IconInfoSquareFilled, IconTableOptions } from "@tabler/icons-react";
import RouteTransitInfo from "./RouteTransitInfo";

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
    const [directionResponseArr, setDirectionResponseArr] = useState<DirectionsResponse[] | null>(null)

    const [travelModeValue, setTravelModeValue] = useState<any | null>(null)
    // const [location, setLocation] = useState<LatLngLiteral>();
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

    function createWayPointArrForTransit(inputEventList: EventItem[]) {
        const wayPointArr: string[] = []
        inputEventList.forEach((event) => {
            wayPointArr.push(event.place_id)
        })
        return wayPointArr
    }

    function handleFormSubmit(data: RouteFormState) {
        if (data.travelMode === 'TRANSIT') {
            const transitPlaceIds = createWayPointArrForTransit(evenList)
            handleGetRoute('', '', transitPlaceIds, data.travelMode as TravelMode)
        } else {
            const startPointId = evenList[0].place_id
            const endPointId = evenList[evenList.length - 1].place_id
            let WayPointArr: DirectionsWayPoint[] = []
            if (evenList.length > 2) {
                WayPointArr = createWayPointArr(evenList)
            }
            handleGetRoute(startPointId, endPointId, WayPointArr, data.travelMode as TravelMode)
        }
    }

    async function handleGetRoute(
        startPointId: string,
        endPointId: string,
        wayPointArr: DirectionsWayPoint[] | string[],
        travelModeValue: TravelMode
    ) {
        setDirectionResponse(null)
        setDirectionResponseArr(null)
        if (travelModeValue !== 'TRANSIT') {
            const res = await getGoogleRoute(
                directionService,
                startPointId,
                endPointId,
                wayPointArr as DirectionsWayPoint[],
                travelModeValue
            )
            if (res) {
                setTravelModeValue(travelModeValue)
                setDirectionResponse(res)
                setShowOverlay(true)
                setShowRouteForm(false)
                setShowRouteInfo(true)
                handleClose()
            } else {
                notify(false, 'Get Route error')
            }
        } else {
            let promises = []
            for (let i = 0; i < wayPointArr.length - 1; i++) {
                const result = await getGoogleRouteTransit(directionService, wayPointArr[i] as string, wayPointArr[i + 1] as string, travelModeValue)
                if (result) {
                    promises.push(result)
                } else {
                    notify(false, 'Get Route error')
                    return
                }
            }
            Promise.all(promises)
                .then((result) => {
                    setTravelModeValue(travelModeValue)
                    setDirectionResponseArr(result as DirectionsResponse[])
                    setShowOverlay(true)
                    setShowRouteForm(false)
                    setShowRouteInfo(true)
                    handleClose()
                })
                .catch((error) => {
                    notify(false, 'Get Route error')
                })
        }
    }

    const handleClose = async () => {
        setAnimation(true)
        // extract this to util
        await new Promise(r => setTimeout(r, 100))
        setAnimation(false)
        setShowRouteForm(false)
        setShowOverlay(false)
    };
    const handleShowRouteFrom = () => {
        setShowOverlay(true)
        setShowRouteForm(true)
        setShowRouteInfo(false)
    }

    const handleShowRouteInfo = () => {
        if (directionResponse || directionResponseArr) {
            setShowOverlay(true)
            setShowRouteInfo(true)
            setShowRouteForm(false)
        }
    }


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
                    {directionResponse && <DirectionsRenderer directions={directionResponse} />}
                    {
                        directionResponseArr ?
                            directionResponseArr.map((direction, index) => {
                                return <div key={index + 'secet123'}>
                                    <DirectionsRenderer directions={direction}
                                        options={{
                                            suppressMarkers: true
                                        }}
                                    />
                                    <Marker options={{
                                        label: { fontSize: '15px', text: String.fromCharCode(index + 65), color: 'white', fontWeight: '1100' }
                                    }}
                                        position={direction.routes[0].legs[0].start_location}
                                    />
                                    <Marker
                                        options={{
                                            label: { fontSize: '15px', text: String.fromCharCode(index + 1 + 65), color: 'white', fontWeight: '1100' }
                                        }}
                                        position={direction.routes[0].legs[0].end_location}
                                    />
                                </div>

                            }) :
                            null
                    }
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
                        showRouteInfo && directionResponseArr &&
                            <RouteTransitInfo travelMode={travelModeValue} directionResponse={directionResponseArr} /> 
                    }
                    {
                        showRouteInfo && directionResponse &&
                            <RouteInfo travelMode={travelModeValue} directionResponse={directionResponse} /> 
                    }
                    {showRouteForm && <div className={`${styles.RouteFormContainer}`}>
                        <RouteForm onSubmit={handleFormSubmit}></RouteForm>
                    </div>}
                </div>
            </div>
        </>
    );
}