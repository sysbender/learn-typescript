import { User } from "./User";
import { Company } from "./Company";
import { Map } from "./Map";

// const apiKey = process.env.PARCEL_GOOGLE_MAPS_KEY;

// if (!apiKey) {
//   console.error("Google Maps API key is missing");
// } else {
//   console.log(` apiKey = ${apiKey}`);
//   const script = document.createElement("script");
//   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
//   script.async = true;
//   document.head.appendChild(script);
// }

const user = new User();
console.log(user);

const company = new Company();
company.print();

//=====================open street map
// Example location: Eiffel Towe r
const lat = 48.8584;
const lng = 2.2945;
const zoom = 13;

// Create a map centered on Eiffel Tower
const map = new Map("map");

// Add some markers
map.addMarker(user);
map.addMarker(company);
