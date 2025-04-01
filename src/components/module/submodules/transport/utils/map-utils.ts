
import { Coordinates, VehicleLocation } from '../types';
import L from 'leaflet';

export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
};

export const normalizeCoordinates = (coords: any): Coordinates => {
  if (!coords) return { latitude: 0, longitude: 0 };

  // Handle different coordinate formats
  if (typeof coords.lat !== 'undefined' && typeof coords.lng !== 'undefined') {
    return { latitude: coords.lat, longitude: coords.lng };
  } else if (typeof coords.latitude !== 'undefined' && typeof coords.longitude !== 'undefined') {
    return { latitude: coords.latitude, longitude: coords.longitude };
  }
  
  return { latitude: 0, longitude: 0 };
};

export const calculateDistance = (coords1: Coordinates, coords2: Coordinates): number => {
  // Simple Euclidean distance - in a real app use a proper geodesic calculation
  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;
  
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // in metres
  
  return d / 1000; // in kilometers
};

export const createMarker = (
  map: L.Map, 
  position: [number, number], 
  options?: L.MarkerOptions
): L.Marker => {
  const marker = L.marker(position, options);
  marker.addTo(map);
  return marker;
};

export const updateMarkerPosition = (
  marker: L.Marker,
  position: [number, number]
): void => {
  marker.setLatLng(position);
};

export const createVehicleIcon = (status: string): L.Icon => {
  // Create icons based on vehicle status
  const iconUrl = status === 'moving' 
    ? '/assets/icons/vehicle-moving.svg'
    : status === 'idle' 
      ? '/assets/icons/vehicle-idle.svg'
      : '/assets/icons/vehicle-stopped.svg';
      
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const getMapCenter = (locations: VehicleLocation[]): [number, number] => {
  if (locations.length === 0) {
    // Default to Paris
    return [48.8566, 2.3522];
  }
  
  // Calculate the center of all locations
  const latSum = locations.reduce((sum, loc) => sum + normalizeCoordinates(loc.coordinates).latitude, 0);
  const lngSum = locations.reduce((sum, loc) => sum + normalizeCoordinates(loc.coordinates).longitude, 0);
  
  return [latSum / locations.length, lngSum / locations.length];
};
