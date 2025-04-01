
import L from 'leaflet';
import { VehicleLocation, Coordinates, TransportVehicleWithLocation } from '../types/transport-types';

// Helper function to check property existence and normalize coordinates
export const normalizeCoordinates = (location: VehicleLocation): { lat: number; lng: number } => {
  // If location already has lat/lng properties, use them
  if ('lat' in location && 'lng' in location) {
    return { lat: location.lat, lng: location.lng };
  }
  
  // If location has coordinates.latitude/longitude properties, use them
  if (location.coordinates && 'latitude' in location.coordinates && 'longitude' in location.coordinates) {
    return { 
      lat: location.coordinates.latitude, 
      lng: location.coordinates.longitude 
    };
  }
  
  // Default fallback (should never happen with proper types)
  return { lat: 0, lng: 0 };
};

// Create a leaflet marker for a vehicle location
export const createMarker = (
  location: VehicleLocation, 
  vehicle: TransportVehicleWithLocation,
  onClick?: (vehicle: TransportVehicleWithLocation) => void
): L.Marker => {
  const coords = normalizeCoordinates(location);
  const marker = L.marker([coords.lat, coords.lng]);
  
  // Set popup content
  marker.bindPopup(`
    <div class="p-2">
      <h3 class="font-medium">${vehicle.name}</h3>
      <p>${vehicle.licensePlate}</p>
      <p>Status: ${location.status}</p>
    </div>
  `);
  
  // Add click handler if provided
  if (onClick) {
    marker.on('click', () => onClick(vehicle));
  }
  
  return marker;
};

// Function to update a marker's position
export const updateMarkerPosition = (marker: L.Marker, location: VehicleLocation): void => {
  const coords = normalizeCoordinates(location);
  marker.setLatLng([coords.lat, coords.lng]);
};

// Calculate the distance between two coordinates in kilometers
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

// Format a timestamp to a readable string
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Get a color based on vehicle status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'moving': return '#4caf50'; // green
    case 'stopped': return '#f44336'; // red
    case 'idle': return '#ff9800'; // orange
    case 'offline': return '#9e9e9e'; // gray
    default: return '#2196f3'; // blue
  }
};
