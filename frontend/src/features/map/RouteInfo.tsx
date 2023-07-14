import React, { useState } from 'react'
import directionResultJSON from './testingGoogleDirectionResults.json'
import styles from '../../css/RouteInfo.module.css'
import { Button, OverlayTrigger, Popover } from 'react-bootstrap'

interface RouteInfoProps {
    travelMode: string;
}

export default function RouteInfo(props: RouteInfoProps) {
    const { legs } = directionResultJSON.routes[0]
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
                legs.map((routeInfo: any, index: number) => {
                    return <div key={index}>
                        <OverlayTrigger
                            trigger='click'
                            key={index}
                            placement='bottom'
                            overlay={
                                <Popover id={`popover-positioned-routeInfo-${index}`}>
                                    <div className={styles.wayPointInfo}>
                                        <div>Distance: {routeInfo.distance.text}</div>
                                        <div>Duration: {routeInfo.duration.text}</div>
                                    </div>
                                </Popover>
                            }
                        >
                            <Button variant="secondary">From: {routeInfo.start_address} to: {routeInfo.end_address}</Button>
                        </OverlayTrigger>
                    </div>
                })
            }
            <div>Total Duration: {totalDurationInHr} {totalDurationInHr === 1 ? `hour` : `hours`} {leftMin} mins</div>
            <div>Total Distance: {totalDistance} km</div>
        </div>
    )
}