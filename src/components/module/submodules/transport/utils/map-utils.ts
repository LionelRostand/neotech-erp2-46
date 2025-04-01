
import { TransportVehicleWithLocation, VehicleLocation } from '../types';

// Format coordinates for display
export const formatCoordinates = (location: VehicleLocation): string => {
  const { latitude, longitude } = location.coordinates;
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};

// Get status text
export const getStatusText = (status: string): string => {
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
};

// Get marker icon for vehicle based on status
export const getMarkerIconForVehicle = (vehicleStatus: string, locationStatus?: string): string => {
  if (vehicleStatus === 'maintenance') {
    return 'https://cdn-icons-png.flaticon.com/512/4426/4426072.png';
  }
  
  if (locationStatus === 'moving') {
    return 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png';
  }
  
  if (locationStatus === 'idle') {
    return 'https://cdn-icons-png.flaticon.com/512/3097/3097156.png';
  }
  
  if (locationStatus === 'stopped') {
    return 'https://cdn-icons-png.flaticon.com/512/3097/3097150.png';
  }

  return 'https://cdn-icons-png.flaticon.com/512/3097/3097156.png'; // Default icon
};

// Generate popup content for a vehicle
export const getVehiclePopupContent = (vehicle: TransportVehicleWithLocation): string => {
  return `
    <div class="p-2">
      <h3 class="font-bold">${vehicle.name}</h3>
      <p>Plaque: ${vehicle.licensePlate}</p>
      <p>Statut: ${getStatusText(vehicle.location.status)}</p>
      <p>Vitesse: ${vehicle.location.speed} km/h</p>
    </div>
  `;
};

// Utility function to convert LeafletJS coordinates to VehicleLocation format
export const normalizeCoordinates = (location: VehicleLocation): [number, number] => {
  return [location.coordinates.latitude, location.coordinates.longitude];
};

// Create a marker on the map
export const createMarker = (vehicle: TransportVehicleWithLocation): any => {
  // This is a stub function that would be implemented in a real app
  // with Leaflet or other mapping library
  return {
    id: vehicle.id,
    vehicleId: vehicle.id,
    position: normalizeCoordinates(vehicle.location),
    icon: getMarkerIconForVehicle(vehicle.status, vehicle.location.status),
    popupContent: getVehiclePopupContent(vehicle)
  };
};

// Update marker position
export const updateMarkerPosition = (marker: any, location: VehicleLocation): any => {
  // This is a stub function that would be implemented in a real app
  if (!marker) return null;
  return {
    ...marker,
    position: normalizeCoordinates(location)
  };
};
