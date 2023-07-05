import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import "../css/googleMap.css";
import { read } from "fs";

type PlacesProps = {
  setLocation: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setLocation }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();


  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    
    const results =await getGeocode({address});
    const {lat, lng} =await getLatLng(results[0]);
    setLocation({lat, lng});
    
  }

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled ={!ready}
        className="combobox-input"
        placeholder="Search a destination"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}
