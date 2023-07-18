import FeatureTab from "./FeatureTab";
import styles from '../../css/Feature.module.css'
import { CloseButton } from "react-bootstrap";

interface FeatureProps{
    onClose?: () => void;
    screenWidth?: number;
}

export default function Feature(props: FeatureProps) {

    return (
        <div className={styles.controlContainer}> 
        {
            props.screenWidth && props.screenWidth <= 450 && <CloseButton id={styles.offcanvasCloseBtn} onClick={props.onClose}/>
        }
            <FeatureTab/>
        </div>
    );
  }
