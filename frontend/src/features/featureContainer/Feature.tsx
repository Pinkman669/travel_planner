
import { useLoadScript } from "@react-google-maps/api";
import { Map } from "../map/GoogleMap";
import FeatureTab from "./FeatureTab";
import "../../css/Feature.css"


export default function Feature() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });
  if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="control-container"> 
        <FeatureTab/>
         <Map />
        </div>
    );
  }
