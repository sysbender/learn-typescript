import L, { Map as leafletMap, Marker } from "leaflet";
export interface Mappable {
  location: { lat: number; lng: number };
  markerContent(): string;
}
export class Map {
  private map: leafletMap;

  constructor(
    containerId: string,
    lat: number = 0,
    lng: number = 0,
    zoom: number = 1
  ) {
    this.map = L.map(containerId).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  /**
   * Adds a marker to the map.
   * @param lat Latitude
   * @param lng Longitude
   * @param label Optional popup label
   */
  public addMarker(mappable: Mappable): Marker {
    const marker = L.marker([
      mappable.location.lat,
      mappable.location.lng,
    ]).addTo(this.map);
    // if (label) {
    marker.bindPopup(mappable.markerContent()).openPopup();
    // }
    return marker;
  }
}
