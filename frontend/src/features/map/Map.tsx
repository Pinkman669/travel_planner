import { useLoadScript } from "@react-google-maps/api";
import { Map } from "./GoogleMap";

export default function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });
  if (!isLoaded) return <div>Loading...</div>;

    return (
      <div className="trip-container">
        <div className="schedule-container">schedule</div>
        <div className="control-container">
          <Map />
        </div>
      </div>
    );
  }
