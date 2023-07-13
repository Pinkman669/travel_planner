import { useLoadScript } from "@react-google-maps/api";
import { GoogleRoute } from "./GoogleRoute";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function MapPage() {
    const [showRoute, setShowRoute] = useState(false)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
        libraries: ["places"],
    });

    return (
        <div className="trip-container">
            <div className="schedule-container">schedule</div>
            <div className="control-container">
                {
                    // !showRoute && 
                    <Button variant="dark" onClick={() => setShowRoute(true)}>Show Route</Button>
                }
                {
                    isLoaded && showRoute && <GoogleRoute />
                }
            </div>
        </div>
    );
}
