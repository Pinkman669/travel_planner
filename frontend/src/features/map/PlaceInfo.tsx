import usePlaceInfo from "./placeAPI";
import add from "../image/add.png";
import favourite from "../image/favourite.png";
import { useState } from "react";
import { NewEventModal } from "../event/NewEventModal";



export default function PlaceInfo() {
  const placeInfo = usePlaceInfo();
  // const [showNewEventModal, setShowNewEventModal] = useState(false);

  return (
    <div className="places-info-container">
      <div className="place_info_top_container">
        <div className="place_name">{placeInfo?.name}</div>
        <div className="feature_container">
          <button className="feature_button"><img src= {favourite} alt ="Favourite"/></button>
          <button className="feature_button"><img src= {add} alt ="add"/></button>
        </div>
      </div>
      <div className="info_detail_title">
        {" "}
        Address:{" "}
        <div className="info_detail">{placeInfo?.formatted_address}</div>
      </div>
      {placeInfo?.opening_hours?.weekday_text && (
        <div className="info_detail_title">
          Business Hours:
          <div className="info_detail">
            {placeInfo?.opening_hours?.weekday_text?.map((hours) => (
              <div>{hours}</div>
            ))}
          </div>
        </div>
      )}
      {placeInfo?.formatted_phone_number && (
        <div className="info_detail_title">
          Phone No. :{" "}
          <div className="info_detail">{placeInfo?.formatted_phone_number}</div>
        </div>
      )}
      {placeInfo?.website && (
        <div className="info_detail_title">
          Website: {"  "}
          <a href={placeInfo?.website} target="_blank">
            {placeInfo?.website}
          </a>
        </div>
      )}
      {/* <NewEventModal
        isShown={newEventModal}
        name = /> */}
    </div>
  );
}
