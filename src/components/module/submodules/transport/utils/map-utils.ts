
import { TransportVehicleWithLocation, VehicleLocation, Coordinates, MapMarker } from '../types';
import { format } from 'date-fns';

// Get a formatted string of coordinates for display
export const getCoordinatesString = (coordinates: Coordinates): string => {
  return `${coordinates.longitude.toFixed(5)}, ${coordinates.latitude.toFixed(5)}`;
};

// Get a Google Maps URL for the coordinates
export const getGoogleMapsUrl = (coordinates: Coordinates): string => {
  return `https://maps.google.com/?q=${coordinates.longitude},${coordinates.latitude}`;
};

// Get map marker for a vehicle
export const getVehicleMarker = (vehicle: TransportVehicleWithLocation): MapMarker => {
  return {
    id: vehicle.id,
    position: [
      vehicle.location.coordinates.latitude,
      vehicle.location.coordinates.longitude
    ],
    popup: getVehiclePopupContent(vehicle),
    icon: getVehicleIcon(vehicle)
  };
};

// Get custom icon for a vehicle based on its type and status
export const getVehicleIcon = (vehicle: TransportVehicleWithLocation) => {
  // This would typically return a custom icon based on vehicle type and status
  // For now, just return a placeholder
  return {};
};

// Generate popup content for a vehicle marker
export const getVehiclePopupContent = (vehicle: TransportVehicleWithLocation): string => {
  const { name, licensePlate, type } = vehicle;
  const { coordinates, status, speed, timestamp } = vehicle.location;
  
  // Format speed with units
  const speedDisplay = speed ? `${speed} km/h` : 'N/A';
  
  // Format timestamp if available
  const timeDisplay = timestamp ? format(new Date(timestamp), 'HH:mm:ss') : 'N/A';
  
  // Build popup HTML content
  return `
    <div class="vehicle-popup">
      <h3>${name}</h3>
      <p>${licensePlate} | ${type}</p>
      <p>Status: ${status}</p>
      <p>Speed: ${speedDisplay}</p>
      <p>Last Update: ${timeDisplay}</p>
    </div>
  `;
};
