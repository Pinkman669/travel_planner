

export async function getGoogleRoute(
    directionService: google.maps.DirectionsService,
    originId: string,
    destinationId: string,
    waypoints: google.maps.DirectionsWaypoint[],
    travelMode: google.maps.TravelMode
) {
    try {
        const result = await directionService.route({
            origin: {
                placeId: originId
            },
            waypoints: waypoints,
            destination: {
                placeId: destinationId
            },
            travelMode: travelMode
        }, (result, status)=> {
            if (status === 'OK'){
                return result
            } else{
                return null
            }
        })

        return result
    } catch (e) {
        return null
    }
}

export async function getGoogleRouteTransit(
    directionService: google.maps.DirectionsService,
    originId: string,
    destinationId: string,
    travelMode: google.maps.TravelMode
) {
    // use await
    return directionService.route({
        origin: {
            placeId: originId
        },
        destination: {
            placeId: destinationId
        },
        travelMode: travelMode
    }, (result, status) =>{
        if (status === 'OK'){
            return result
        } else{
            return null
        }
    })
        .then((result) => {
            return result
        })
        .catch((error) =>{
            return null
        })
}