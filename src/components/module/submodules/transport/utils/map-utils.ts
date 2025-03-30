
import { TransportVehicleWithLocation, MapConfig } from '../types/map-types';

// Calculate the optimal map center and zoom based on vehicle positions
export const calculateMapCenter = (
  vehicles: TransportVehicleWithLocation[],
  defaultLat: number,
  defaultLng: number,
  defaultZoom: number
) => {
  // If there are no vehicles with location data, return default values
  const vehiclesWithLocation = vehicles.filter(v => v.location && 
    ((v.location.lat && v.location.lng) || (v.location.latitude && v.location.longitude)));
  
  if (vehiclesWithLocation.length === 0) {
    return { latitude: defaultLat, longitude: defaultLng, zoom: defaultZoom };
  }

  // If there's only one vehicle, center on it
  if (vehiclesWithLocation.length === 1) {
    const vehicle = vehiclesWithLocation[0];
    const latitude = vehicle.location.lat || vehicle.location.latitude;
    const longitude = vehicle.location.lng || vehicle.location.longitude;
    
    return { 
      latitude, 
      longitude,
      zoom: Math.max(14, defaultZoom) // Higher zoom for single vehicle
    };
  }

  // For multiple vehicles, calculate bounding box
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  vehiclesWithLocation.forEach(vehicle => {
    const lat = vehicle.location.lat || vehicle.location.latitude;
    const lng = vehicle.location.lng || vehicle.location.longitude;
    
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  // Calculate center of bounding box
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;

  // Calculate appropriate zoom level based on bounding box size
  // This is a simplified calculation - in real world applications, you might want to use
  // a more sophisticated algorithm based on the map's viewport size
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  
  let zoom = defaultZoom;
  if (maxDiff > 0.5) zoom = 8;
  else if (maxDiff > 0.2) zoom = 10;
  else if (maxDiff > 0.1) zoom = 11;
  else if (maxDiff > 0.05) zoom = 12;
  else if (maxDiff > 0.01) zoom = 13;
  else zoom = 14;
  
  return { latitude, longitude, zoom };
};

// Get marker color based on vehicle status
export const getMarkerColorByStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'en service':
    case 'available':
    case 'active':
      return '#22c55e'; // green-500
    case 'arrêté':
    case 'idle':
      return '#eab308'; // yellow-500
    case 'maintenance':
      return '#f97316'; // orange-500
    case 'issue':
    case 'problem':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

// Get tile layer configuration based on provider
export const getTileLayerConfig = (provider: string = 'osm-france') => {
  switch (provider) {
    case 'osm-france':
      return {
        url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        maxZoom: 19
      };
    case 'osm':
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        maxZoom: 19
      };
    case 'carto':
      return {
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        minZoom: 2,
        maxZoom: 19
      };
    default:
      return {
        url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        maxZoom: 19
      };
  }
};
