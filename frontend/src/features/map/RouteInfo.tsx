import React from 'react'
import styles from '../../css/RouteInfo.module.css'
import { Button, OverlayTrigger, Popover, PopoverHeader } from 'react-bootstrap'

interface RouteInfoProps {
    directionResponse: google.maps.DirectionsResult
    travelMode: string;
}

export default function RouteInfo(props: RouteInfoProps) {
    const { legs } = props.directionResponse.routes[0]
    const totalDurationInSec = legs.reduce((acc: number, routeInfo: any, index: number) => {
        return acc += Number(routeInfo.duration.value)
    }, 0)

    const totalDurationInMin = totalDurationInSec / 60
    const totalDurationInHr = Math.floor(totalDurationInMin / 60)
    const leftMin = Math.round(totalDurationInMin % 60)


    const totalDistance = legs.reduce((acc: number, routeInfo: any) => {
        return acc += Number(routeInfo.distance.value)
    }, 0) / 1000

    return (
        <div className={styles.RouteInfoContainer}>
            <div>Travel Mode: {props.travelMode.toLocaleLowerCase()}</div>
            {
                legs.map((routeInfo: google.maps.DirectionsLeg, index: number) => {
                    return <div key={index+'secret1234567894564'} className={styles.routeInfoDiv}>
                        <OverlayTrigger
                            trigger={'click'}
                            key={index}
                            placement='bottom'
                            overlay={
                                <Popover id={`popover-positioned-routeInfo-${index}`}>
                                    <PopoverHeader>
                                        <div>From: {routeInfo.start_address}</div>
                                        <div>To: {routeInfo.end_address}</div>
                                    </PopoverHeader>
                                    <div className={styles.wayPointInfo}>
                                        <div>Distance: {routeInfo.distance!.text}</div>
                                        <div>Duration: {routeInfo.duration!.text}</div>
                                        {
                                            props.travelMode === 'TRANSIT' ?
                                                <div>Steps:
                                                    <ol>
                                                        {
                                                            routeInfo.steps.map((step, index) => {
                                                                return <li key={index + step.instructions}>
                                                                    <div>{step.instructions}</div>
                                                                    {
                                                                        step.transit?.line.agencies?.map((agency) => {
                                                                            // use ? :
                                                                            if (agency) {
                                                                                return <div key={index + agency?.name}>By {agency?.name}</div>
                                                                            }
                                                                            return null
                                                                        })
                                                                    }
                                                                </li>
                                                            })
                                                        }
                                                    </ol>
                                                </div> :
                                                null
                                        }
                                    </div>
                                </Popover>
                            }
                        >
                            <Button variant="secondary">WayPoint {String.fromCharCode((index % 26) + 65)} to {String.fromCharCode((index % 26) + 1 + 65)}</Button>
                        </OverlayTrigger>
                    </div>
                })
            }
            <div className={styles.routeInfoDiv}>Total Duration: {totalDurationInHr} {totalDurationInHr === 1 ? `hour` : `hours`} {leftMin} mins</div>
            <div className={styles.routeInfoDiv}>Total Distance: {totalDistance} km</div>
        </div>
    )
}