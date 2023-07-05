// import { useQuery, useMutation } from "@tanstack/react-query";

// interface placeInfo {
// 	id: string;
// 	name: string;
// 	formatted_address: string;
//   opening_hours: string[];
//   ranking: string;
//   formatted_phone_number: string;
//   website: string
// }



// export default function usePlaceInfo() {
//   const { isLoading, error, data, isFetching } = useQuery({
//     queryKey: ["placeInfo"],
//     queryFn: async (place_id) => {
//         const res =
//         await fetch(`
//         https://maps.googleapis.com/maps/api/place/details/json
//       ?fields=name%2Cformatted_address%2Copening_hours/weekday_text%2Cranking%2Cformatted_phone_number%2Cwebsite
//       &place_id=${place_id}
//       &key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}
//       `)
//         const result = await res.json()
//       return result.data.map(placeInfo as placeInfo) => {
//         <div>{placeInfo.name}</div>
//       }
//     }
//   })
//   if (isLoading || isFetching || error || !data) {
//     return [];
//   }
//   return ;
// }




