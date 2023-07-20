import { Tab, Tabs } from "react-bootstrap";
import { Map } from "../map/GoogleMap";
import { useLoadScript } from "@react-google-maps/api";
import EventsRoute from "../map/EventsRoute";
import styles from '../../css/FeatureTabs.module.css'
import { IconHeartPlus, IconRoute, IconWorld } from "@tabler/icons-react";
import '../../css/customBSCss.css'
import FavouriteEvent from "../event/FavouriteEvent";

type Libraries = ("drawing" | "geometry" | "localContext" | "places")[];
const libraries: Libraries = ['places']

export default function FeatureTab() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
    libraries: libraries,
  });
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div id={styles.featuresContainer}>
      <Tabs
        defaultActiveKey="Map"
        id="feature-tabs"
      >
        <Tab eventKey="Map" title={<IconWorld id={styles.mapIcon} />}>
          <Map />
        </Tab>
        <Tab eventKey="Fav" title={<IconHeartPlus id={styles.favIcon}/>}>
          <FavouriteEvent/>
        </Tab>
        <Tab eventKey="Route" title={<IconRoute id={styles.routeIcon}/>}>
          <EventsRoute />
        </Tab>
      </Tabs>
    </div>
  );
}
