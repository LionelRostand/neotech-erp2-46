import { Coordinates, MapMarker, TransportVehicleWithLocation } from '../types';

// Normalize coordinates to a format expected by the map components
export function normalizeCoordinates(coords: Coordinates): [number, number] {
  // If coordinates has nested coordinates property, use it
  if (coords.coordinates && coords.coordinates.latitude && coords.coordinates.longitude) {
    return [coords.coordinates.longitude, coords.coordinates.latitude];
  }
  
  // Otherwise use the direct latitude and longitude properties
  return [coords.longitude, coords.latitude];
}

// Format location information
export function formatLocationData(location: any): string {
  if (!location) return 'Non disponible';
  
  // If it's a string (address), return it directly
  if (typeof location === 'string') return location;
  
  // If it has an address property, return that
  if (location.address) return location.address;
  
  // If it's a coordinate pair, format it
  if (location.latitude && location.longitude) {
    return `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`;
  }
  
  // Default fallback
  return 'Non disponible';
}

// Get a human-readable vehicle status
export function formatVehicleStatus(status: string): string {
  const statusMap: {[key: string]: string} = {
    'available': 'Disponible',
    'in-use': 'En service',
    'maintenance': 'En maintenance',
    'reserved': 'Réservé',
    'out-of-service': 'Hors service',
    'active': 'Actif',
    'inactive': 'Inactif'
  };
  
  return statusMap[status] || status;
}

// Format speed from coordinates
export function formatSpeed(coords: Coordinates): string {
  if (!coords.speed) return '0 km/h';
  return `${Math.round(coords.speed)} km/h`;
}

// Format timestamp from coordinates
export function formatTimestamp(coords: Coordinates): string {
  if (!coords.timestamp) return 'Non disponible';
  
  try {
    const date = new Date(coords.timestamp);
    return date.toLocaleString('fr-FR');
  } catch (e) {
    return 'Format de date invalide';
  }
}

// Generate popup content for vehicle markers
export function getVehiclePopupContent(vehicle: TransportVehicleWithLocation): string {
  return `
    <div class="vehicle-popup">
      <h3>${vehicle.name}</h3>
      <p><strong>Statut:</strong> ${formatVehicleStatus(vehicle.status)}</p>
      <p><strong>Immatriculation:</strong> ${vehicle.licensePlate}</p>
      <p><strong>Vitesse:</strong> ${formatSpeed(vehicle.location.coordinates)}</p>
      <p><strong>Dernière mise à jour:</strong> ${formatTimestamp(vehicle.location.coordinates)}</p>
      ${vehicle.driverName ? `<p><strong>Chauffeur:</strong> ${vehicle.driverName}</p>` : ''}
      <button class="popup-button" onclick="window.selectVehicle('${vehicle.id}')">
        Détails
      </button>
    </div>
  `;
}

// Create a custom icon for vehicle markers
export function createVehicleIcon(vehicle: TransportVehicleWithLocation): any {
  // This would normally return a Leaflet icon object
  // For now, we'll return a placeholder object
  return {
    className: `vehicle-marker vehicle-${vehicle.status}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    html: `<div class="vehicle-icon ${vehicle.type}"></div>`
  };
}

// Calculate the center point of multiple coordinates
export function calculateCenter(coordinates: Coordinates[]): [number, number] {
  if (coordinates.length === 0) {
    return [48.8566, 2.3522]; // Default to Paris
  }
  
  if (coordinates.length === 1) {
    return [coordinates[0].latitude, coordinates[0].longitude];
  }
  
  let totalLat = 0;
  let totalLng = 0;
  
  coordinates.forEach(coord => {
    totalLat += coord.latitude;
    totalLng += coord.longitude;
  });
  
  return [totalLat / coordinates.length, totalLng / coordinates.length];
}

// Calculate appropriate zoom level based on coordinates spread
export function calculateZoom(coordinates: Coordinates[]): number {
  if (coordinates.length <= 1) {
    return 13; // Default zoom for single point
  }
  
  // Find min/max lat/lng
  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;
  
  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });
  
  // Calculate the distance
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  
  // Determine zoom based on distance
  if (maxDiff > 1) return 8;
  if (maxDiff > 0.5) return 9;
  if (maxDiff > 0.2) return 10;
  if (maxDiff > 0.1) return 11;
  if (maxDiff > 0.05) return 12;
  if (maxDiff > 0.01) return 13;
  return 14;
}
