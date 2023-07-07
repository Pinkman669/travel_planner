import usePlaceInfo from "./placeAPI";


export default function PlaceInfo() {
  const placeInfo = usePlaceInfo();
  return (
    <div>{placeInfo?.name}</div>
  )
  }

