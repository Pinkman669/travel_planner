import React, { useState } from 'react'
import styles from '../../css/RouteInfo.module.css'
import { Button, CloseButton, OverlayTrigger, Popover, PopoverHeader } from 'react-bootstrap';

interface RouteInfoProps {
    directionResponse: google.maps.DirectionsResult[]
    travelMode: string;
}

export default function RouteInfo(props: RouteInfoProps) {
    const [showPopover, setShowPopover] = useState(true)
    let totalDurationInSec = 0
    let totalDistance = 0

    for (let directionRes of props.directionResponse) {
        const { legs } = directionRes.routes[0]

        totalDurationInSec += legs.reduce((acc: number, routeInfo: any, index: number) => {
            return acc += Number(routeInfo.duration.value)
        }, 0)

        totalDistance += legs.reduce((acc: number, routeInfo: any) => {
            return acc += Number(routeInfo.distance.value)
        }, 0) / 1000
    }

    const totalDurationInMin = totalDurationInSec / 60
    const totalDurationInHr = Math.floor(totalDurationInMin / 60)
    const leftMin = Math.round(totalDurationInMin % 60)

    function handlePopover(){
        setShowPopover(false)
    }

    return (
        <div className={styles.RouteInfoContainer}>
            <div>Travel Mode: {props.travelMode.toLocaleLowerCase()}</div>
            {
                props.directionResponse.map((directionRes, index) =>{
                    const { legs } = directionRes.routes[0]
                    return legs.map((routeInfo: google.maps.DirectionsLeg) =>{
                        return <div key={index+'secret456789'} className={styles.routeInfoDiv}>
                            <OverlayTrigger
                            trigger={'click'}
                            key={index}
                            placement='bottom'
                            overlay={
                                <Popover id={`popover-positioned-routeInfo-${index}`} show={showPopover}>
                                    <PopoverHeader>
                                    <div className={styles.closeBtnContainer}>
                                        <CloseButton onClick={handlePopover} className={styles.popoverCloseBtn}/>
                                    </div>
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
                                                            routeInfo.steps.map((step, routeInfoIndex) => {
                                                                return <li key={routeInfoIndex + step.instructions}>
                                                                    <div>{step.instructions}</div>
                                                                    {
                                                                        step.transit?.line.agencies?.map((agency) => {
                                                                            if (agency) {
                                                                                return <div key={routeInfoIndex + agency?.name}>By {agency?.name}</div>
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
                })
            }
            <div>Total duration: {totalDurationInHr} hr {leftMin} mins</div>
            <div>Total distance: {totalDistance} km</div>
        </div>
    )
}