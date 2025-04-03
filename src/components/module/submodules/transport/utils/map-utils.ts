
import { Coordinates, VehicleLocation, TransportVehicleLocation, TransportVehicleWithLocation } from '../types';

// Normalize coordinates from different sources to a standard Coordinates format
export function normalizeCoordinates(location: VehicleLocation | { lat: number; lng: number; } | TransportVehicleLocation): Coordinates {
  if ('coordinates' in location) {
    return location.coordinates;
  }
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
    address: vehicleLocation.address,
    coordinates: vehicleLocation.coordinates,
    status: vehicleLocation.status,
    heading: vehicleLocation.heading,
    speed: vehicleLocation.speed,
    timestamp: vehicleLocation.timestamp
  };
}

// Generate vehicle popup content for maps
export function getVehiclePopupContent(vehicle: TransportVehicleWithLocation): string {
  const location = 'coordinates' in vehicle.location 
    ? vehicle.location 
    : { ...vehicle.location, coordinates: { latitude: vehicle.location.lat, longitude: vehicle.location.lng } };
  
  const status = location.status || 'unknown';
  const speed = location.speed ? `${location.speed} km/h` : 'N/A';
  
  return `
    <div class="p-2">
      <h3 class="font-bold">${vehicle.name}</h3>
      <p>Plaque: ${vehicle.licensePlate}</p>
      <p>Statut: ${getVehicleStatusText(status)}</p>
      <p>Vitesse: ${speed}</p>
      ${location.timestamp ? `<p>Mise à jour: ${formatTimestamp(location.timestamp)}</p>` : ''}
    </div>
  `;
}

// Get text for vehicle status
export function getVehicleStatusText(status: string): string {
  switch (status) {
    case 'moving':
      return 'En mouvement';
    case 'idle':
      return 'À l\'arrêt';
    case 'stopped':
      return 'Immobilisé';
    default:
      return status;
  }
}
