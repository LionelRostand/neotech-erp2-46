
import { Coordinates, VehicleLocation, TransportVehicleLocation, TransportVehicleWithLocation } from '../types';

// Normalize coordinates from different sources to a standard Coordinates format
export function normalizeCoordinates(location: VehicleLocation | { lat: number; lng: number; }): Coordinates {
  return {
    latitude: location.lat,
    longitude: location.lng
  };
}

// Calculate distance between two coordinates in kilometers
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Convert speed from m/s to km/h
export function convertSpeed(speedMps: number): number {
  return speedMps * 3.6; // 1 m/s = 3.6 km/h
}

// Format timestamp to readable time
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Normalize TransportVehicleLocation to VehicleLocation
export function normalizeVehicleLocation(vehicleLocation: TransportVehicleLocation): VehicleLocation {
  return {
    lat: vehicleLocation.coordinates.latitude,
    lng: vehicleLocation.coordinates.longitude,
    address: vehicleLocation.address
  };
}
