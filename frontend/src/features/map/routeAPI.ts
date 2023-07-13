export default async function useGoogleRoute(
    origin: string,
    destination: string,
    travelMode: google.maps.TravelMode
) {
    const directionService = new google.maps.DirectionsService()

    const result = await directionService.route({
        origin: origin,
        destination: destination,
        travelMode: travelMode
    })

    console.log(result)
    return result
}