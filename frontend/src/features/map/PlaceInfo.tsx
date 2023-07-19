import usePlaceInfo, { LocationDetail, addFavouriteLocation } from "../event/EventAPI";
import add from "../image/add.png";
import favourite from "../image/favourite.png";
import { useState } from "react";
import { NewEventModal } from "../event/NewEventModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "../utils/utils";
import { useParams } from "react-router-dom";



export default function PlaceInfo() {
  const { tripId } = useParams();
  const placeInfo = usePlaceInfo();
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const queryClient = useQueryClient();
  const addFavourite = useMutation(
    async (placeInfo: google.maps.places.PlaceResult) => {
      const detail: LocationDetail = {
        name: placeInfo.name,
        place_id: placeInfo.place_id,
        formatted_address: placeInfo.formatted_address,
        formatted_phone_number: placeInfo.formatted_phone_number,
        opening_hours: placeInfo.opening_hours?.weekday_text,
        website: placeInfo.website,
      };

      return await addFavouriteLocation(detail, tripId!);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["eventItems"]);
        notify(true, "Added to favourite item");
      },
      onError: () => {
        notify(false, "Add to favourite failed");
      },
    }
  );

  return (
    <div className="places-info-container">
      <div className="place_info_top_container">
        <div className="place_name">{placeInfo?.name}</div>
        <div className="feature_container">
          <button
            className="feature_button"
            onClick={() => addFavourite.mutate(placeInfo!)}
          >
            <img src={favourite} alt="Favourite" />
          </button>
          <button
            className="feature_button"
            onClick={() => setShowNewEventModal(true)}
          >
            <img src={add} alt="add" />
          </button>
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
            {placeInfo?.opening_hours?.weekday_text?.map((hours, index) => (
              <div key={hours+index}>{hours}</div>
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
          <a href={placeInfo?.website} target="_blank" rel="noreferrer noopener">
            {placeInfo?.website}
          </a>
        </div>
      )}

      {placeInfo?.formatted_address && (
        <NewEventModal
          isShown={showNewEventModal}
          name={placeInfo?.name || ""}
          address={placeInfo?.formatted_address}
          business_hours={placeInfo?.opening_hours?.weekday_text || null}
          phone={placeInfo?.formatted_phone_number || ""}
          website={placeInfo?.website || ""}
          onHide={() => setShowNewEventModal(false)}
        />
      )}
    </div>
  );
}
