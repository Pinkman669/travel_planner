import { useQuery } from "@tanstack/react-query";
import { getDetails } from "use-places-autocomplete";
import { useAppSelector } from "../../redux/hooks";

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
        ]
    }
const { isLoading, error, data, isFetching} = useQuery({
  queryKey: ["placeDetail",placeId],
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
