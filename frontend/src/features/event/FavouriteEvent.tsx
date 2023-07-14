import { useAppSelector } from "../../redux/hooks";
import PlaceInfo from "../map/PlaceInfo";

export function FavEvent() {
  const favourite = useAppSelector((state) => state.place.favourite);

  return;
  <div className="favourite-page">
    <PlaceInfo />
  </div>;
}
