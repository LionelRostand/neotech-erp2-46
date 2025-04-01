
import { TransportVehicleWithLocation } from '../types/transport-types';

// Function to get marker icon based on vehicle type and status
export const getMarkerIconForVehicle = (vehicle: TransportVehicleWithLocation): string => {
  // Base icon path
  const basePath = '/assets/markers/';
  
  // Determine color based on status
  let color = 'blue';
  if (vehicle.location.status === 'stopped') color = 'red';
  else if (vehicle.location.status === 'idle') color = 'yellow';
  
  // Determine icon based on type
  let icon = 'car';
  if (vehicle.type === 'van' || vehicle.type === 'minibus') icon = 'van';
  else if (vehicle.type === 'luxury') icon = 'luxury';
  
  // Default icon if asset not found
  return `${basePath}${icon}-${color}.png`;
};

// Function to generate HTML content for vehicle popups
export const getVehiclePopupContent = (vehicle: TransportVehicleWithLocation): string => {
  const { name, licensePlate, type, status } = vehicle;
  const { status: locationStatus, speed } = vehicle.location;
  
  // Get coordinates for display
  const latitude = vehicle.location.coordinates.latitude;
  const longitude = vehicle.location.coordinates.longitude;
  
  return `
    <div class="vehicle-popup">
      <h3 class="text-lg font-bold">${name}</h3>
      <div class="text-sm">
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Plaque:</strong> ${licensePlate}</p>
        <p><strong>Statut:</strong> ${status}</p>
        <p><strong>Activité:</strong> ${locationStatus}</p>
        <p><strong>Vitesse:</strong> ${speed} km/h</p>
        <p><strong>Position:</strong> ${latitude.toFixed(5)}, ${longitude.toFixed(5)}</p>
      </div>
    </div>
  `;
};

// Function to format coordinates for display
export const formatCoordinates = (location: any): string => {
  // Handle different coordinate formats
  const latitude = location.coordinates?.latitude || location.latitude;
  const longitude = location.coordinates?.longitude || location.longitude;
  
  if (latitude === undefined || longitude === undefined) {
    return 'Coordonnées non disponibles';
  }
  
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};
