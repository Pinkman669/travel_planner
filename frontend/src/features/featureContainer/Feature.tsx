import { useLoadScript } from "@react-google-maps/api";
import { Map } from "../map/GoogleMap";
import FeatureTab from "./FeatureTab";
// import "../../css/Feature.css"
import FavouriteEvent from "../event/FavouriteEvent";


export default function Feature() {
  

    return (
        <div className="control-container"> 
        <FeatureTab/>
        </div>
    );
  }
