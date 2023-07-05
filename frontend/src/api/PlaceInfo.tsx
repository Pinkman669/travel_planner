
export {};

// const request = {
//     placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
//     fields: ["name", "formatted_address", "place_id", "geometry"],
//   };

//   const infowindow = new google.maps.InfoWindow();
//   const service = new google.maps.places.PlacesService(map);

//   service.getDetails(request, (place, status) => {
//     if (
//       status === google.maps.places.PlacesServiceStatus.OK &&
//       place &&
//       place.geometry &&
//       place.geometry.location
//     ) {
//       const marker = new google.maps.Marker({
//         map,
//         position: place.geometry.location,
//       });
//     }
// })