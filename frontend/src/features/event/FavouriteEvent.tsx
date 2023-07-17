import usePlaceInfo, {
  LocationDetail,
  addFavouriteLocation,
  useFavouriteEvent,
} from "../event/EventAPI";
import add from "../image/add.png";
import { useState } from "react";
import { NewEventModal } from "../event/NewEventModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import "../../css/Favourite.css";
import "../../css/googleMap.css";

export interface FavouriteDetail {
  name?: string;
  address: string;
  phone?: string;
  business_hours?: string;
  website?: string;
  place_id: string;
}

export default function FavouriteEvent() {
  const { tripId } = useParams();
  const placeInfo = usePlaceInfo();
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const queryClient = useQueryClient();
  const favouriteEvent = useFavouriteEvent(tripId!);

  return (
    <div className="favourite-page">
{favouriteEvent.map((item) => (
      <div className="places-info-container">
        <div className="place_info_top_container">
          <div className="place_name">{item.name}</div>
          <div className="feature_container">
            <button
              className="feature_button"
              onClick={() => setShowNewEventModal(true)}
            >
              <img src={add} alt="add" />
            </button>
          </div>
        </div>
        <div className="info_detail_title">
          Address:{" "}
          <div className="info_detail">{item.location}</div>
        </div>

        {item.business_hours && (
          <div className="info_detail_title">
            Business Hours:{" "}
            <div className="info_detail">
            {item.business_hours}
            </div>
          </div>
        )}

        {item.phone && (
          <div className="info_detail_title">
            Phone No. :{" "}
            <div className="info_detail">
              {item.phone}
            </div>
          </div>
        )}

        {item.website && (
          <div className="info_detail_title">
            Website: {"  "}
            <a href={item?.website} target="_blank">
              {item.website}
            </a>
          </div>
        )}

        {placeInfo?.formatted_address && (
          <NewEventModal
            isShown={showNewEventModal}
            name={item.name || ""}
            address={item.location}
            business_hours={item.business_hours || null}
            phone={item.phone || ""}
            website={item.website || ""}
            onHide={() => setShowNewEventModal(false)}
          />
        )}
      </div>
      ))}
    </div>
  );
}
