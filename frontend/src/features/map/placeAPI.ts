import { useQuery } from "@tanstack/react-query";
import { getDetails } from "use-places-autocomplete";
import { useAppSelector } from "../../redux/hooks";
import { Interface } from "readline";

export interface LocationDetail {
  name:string,
  formatted_address: string,
  formatted_phone_number: string,
  opening_hours: string[],
  website: string,
  place_id: string
}

export default function usePlaceInfo() {
  const placeId = useAppSelector((state) => state.place.placeId!);

  const placeInfo = {
    placeId: placeId,
    fields: [
      "name",
      "formatted_address",
      "formatted_phone_number",
      "opening_hours",
      "website",
      "place_id"
    ]
  }
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["placeDetail", placeId],
    queryFn: async () => {
      const detail = (await getDetails(
        placeInfo
      )) as google.maps.places.PlaceResult;
      return detail
    },
  });

  if (isLoading || error || !data || isFetching) {
    return null;
  }
  return data
}

export async function addFavouriteLocation(data: LocationDetail) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/place/addFavouriteLocation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      data
    })
  })

  if (res.status === 200) {
    return true
  } else {
    return false
  }
}
