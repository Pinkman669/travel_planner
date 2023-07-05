import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import Places from "./PlaceSearch";
import "../css/googleMap.css";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export function Map() {
  
  const [location, setLocation] = useState<LatLngLiteral>();
  const mapRef = useRef<GoogleMap>();
  const onLoad = useCallback((map: any) => (mapRef.current = map), []);
  const center = useMemo<LatLngLiteral>(() => ({ lat: 43.4722893, lng: -80.5474325 }), []); 
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "cb967ffe6985ef4e", // the style of the map
      disableDefaultUI: true, // the option to change the view of the map, it's set to street view right now
      clickableIcons: false, // the option to click on the icons that shows up on the map
    }),
    []
  );

  if (process.env.REACT_APP_MAP_DISPLAY === "1") {
    return (
      <div className="container">
        <div className="schedule-container">schedule</div>
        <div className="control-container">
          <div className="search-container">
            <Places
              setLocation={(position) => {
                setLocation(position);
                mapRef.current?.panTo(position);
              }}
            />
          </div>

          <GoogleMap
            zoom={13}
            center={center}
            mapContainerClassName="map-container"
            options={options}
            onLoad={onLoad}
          >
            {location && <Marker position={location}  />}
          </GoogleMap>
          <div className="places-info-container">

          </div>
        </div>
      </div>
    );
  } else {
    return <div>Map display off</div>;
  }
}
