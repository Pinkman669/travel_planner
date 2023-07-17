import FeatureTab from "./FeatureTab";
import "../../css/Feature.css"
import { CloseButton } from "react-bootstrap";

interface FeatureProps{
    onClose?: () => void;
    screenWidth?: number;
}

export default function Feature(props: FeatureProps) {

    return (
        <div className="control-container"> 
        {
            props.screenWidth && props.screenWidth <= 400 && <CloseButton id='offcanvasCloseBtn' onClick={props.onClose}/>
        }
            <FeatureTab/>
        </div>
    );
  }
