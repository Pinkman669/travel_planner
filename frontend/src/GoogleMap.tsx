import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./googleMap.css";

export function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
  });

  if (!isLoaded) return <div>loading ...</div>;

  if (process.env.REACT_APP_MAP_DISPLAY === "1") {
    return (
      <GoogleMap
        zoom={10}
        center={{ lat: 44, lng: -80 }}
        mapContainerClassName="map-container"
      >
        <Marker position={{ lat: 44, lng: -80 }} />
      </GoogleMap>
    );
  } else {
    return <div>Map display off</div>;
  }
}
