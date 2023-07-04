import { useLoadScript } from "@react-google-maps/api";
import { Map } from "./GoogleMap";
import React from "react";


export default function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });
  if (!isLoaded) return <div>Loading...</div>;
  return <Map/>;
}
