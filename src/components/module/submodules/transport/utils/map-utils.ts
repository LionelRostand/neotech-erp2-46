
import { MapConfig, TransportVehicleWithLocation } from '../types/map-types';

/**
 * Choose the correct tile layer URL and attribution based on provider
 */
export const getTileLayerConfig = (provider: MapConfig['tileProvider']) => {
  switch (provider) {
    case 'osm':
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 1,
        maxZoom: 19
      };
    case 'carto':
      return {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 19
      };
    case 'osm-france':
    default:
      return {
        url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
      };
  }
};

/**
 * Calculate the center coordinates and zoom level based on vehicles positions
 */
export const calculateMapCenter = (
  vehicles: TransportVehicleWithLocation[],
  defaultLat: number,
  defaultLng: number,
  defaultZoom: number
) => {
  let latitude = defaultLat;
  let longitude = defaultLng;
  let zoom = defaultZoom;
  
  const vehiclesWithLocation = vehicles.filter(v => v.location);
  if (vehiclesWithLocation.length > 0) {
    const bounds = vehiclesWithLocation.map(v => [v.location!.lat, v.location!.lng]);
    if (bounds.length > 0) {
      const firstVehicle = vehiclesWithLocation[0];
      latitude = firstVehicle.location!.lat;
      longitude = firstVehicle.location!.lng;
    }
  }
  
  return { latitude, longitude, zoom };
};

/**
 * Get appropriate color for vehicle marker based on status
 */
export const getMarkerColorByStatus = (status: string): string => {
  if (status === "arrêté") {
    return "#FFC107"; // Yellow for stopped
  } else if (status === "maintenance") {
    return "#FF9800"; // Orange for maintenance
  }
  return "#4CAF50"; // Default green
};
