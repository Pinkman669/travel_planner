export default async function getGoogleRoute(
    directionService: google.maps.DirectionsService,
    originId: string,
    destinationId: string,
    waypoints: google.maps.DirectionsWaypoint[],
    travelMode: google.maps.TravelMode
) {
    try{
        const result = await directionService.route({
            origin: {
                placeId: originId
            },
            waypoints: waypoints,
            destination: {
                placeId: destinationId
            },
            travelMode: travelMode
        })
    
        return result
    } catch(e){
        return null
    }
}