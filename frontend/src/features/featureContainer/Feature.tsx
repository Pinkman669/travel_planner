import FeatureTab from "./FeatureTab";
import styles from '../../css/Feature.module.css'
import { CloseButton } from "react-bootstrap";

interface FeatureProps{
    onClose?: () => void;
    isLargeScreen?: boolean;
}

export default function Feature(props: FeatureProps) {
    const isLargeScreen = props.isLargeScreen

    return (
        <div className={styles.controlContainer}> 
        {
            !isLargeScreen && <CloseButton id={styles.offcanvasCloseBtn} onClick={props.onClose}/>
        }
            <FeatureTab/>
        </div>
    );
  }
