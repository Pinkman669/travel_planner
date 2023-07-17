import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import PlaceSearch from "./PlaceSearch";
import "../../css/googleMap.css";
import PlaceInfo from "./PlaceInfo";
import { useAppSelector } from "../../redux/hooks";


type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions; 

export function Map() {
  const placeId = useAppSelector((state) => state.place.placeId);
  const [location, setLocation] = useState<LatLngLiteral>();
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
      disableDefaultUI: true, // the option to change the view of the map, it's set to street view right now
      clickableIcons: false, // the option to click on the icons that shows up on the map
    }),
    []
  );

  if (process.env.REACT_APP_MAP_DISPLAY === "1") {

    return (
      <div className="search-page">
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {location && <Marker position={location} />}
          
        </GoogleMap>
        <PlaceSearch
          setLocation={(position) => {
            setLocation(position);
            mapRef.current?.panTo(position);
          }}
        />
        {placeId && <PlaceInfo/>}
      </div>
    );
  } else {
    return <div>Map display off</div>;
  }
}
