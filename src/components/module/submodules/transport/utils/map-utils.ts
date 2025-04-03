
import { TransportVehicleWithLocation } from '../types/transport-types';

// Add the missing function to generate popup content
export const getVehiclePopupContent = (vehicle: TransportVehicleWithLocation): string => {
  return `
    <div class="p-2">
      <h3 class="font-bold">${vehicle.name}</h3>
      <p>Plaque: ${vehicle.licensePlate}</p>
      <p>Statut: ${vehicle.status}</p>
      ${vehicle.driverName ? `<p>Chauffeur: ${vehicle.driverName}</p>` : ''}
      <p>Dernière mise à jour: ${new Date(vehicle.location.timestamp).toLocaleString()}</p>
    </div>
  `;
};

// Function to convert location data to map markers
export const convertToMapMarkers = (vehicles: TransportVehicleWithLocation[]) => {
  return vehicles.map(vehicle => ({
    id: vehicle.id,
    position: [vehicle.location.coordinates.latitude, vehicle.location.coordinates.longitude],
    name: vehicle.name,
    status: vehicle.status,
    info: {
      licensePlate: vehicle.licensePlate,
      driverName: vehicle.driverName || 'No driver assigned',
      lastUpdate: new Date(vehicle.location.timestamp).toLocaleString()
    }
  }));
};

// Function to get center coordinates for a map from vehicle locations
export const getCenterCoordinates = (vehicles: TransportVehicleWithLocation[]) => {
  if (vehicles.length === 0) {
    return [48.8566, 2.3522]; // Default to Paris coordinates
  }

  const totalLat = vehicles.reduce((sum, vehicle) => 
    sum + vehicle.location.coordinates.latitude, 0);
  const totalLng = vehicles.reduce((sum, vehicle) => 
    sum + vehicle.location.coordinates.longitude, 0);

  return [totalLat / vehicles.length, totalLng / vehicles.length];
};

// Function to handle geolocation API errors
export const handleGeolocationError = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "L'utilisateur a refusé la demande de géolocalisation.";
    case error.POSITION_UNAVAILABLE:
      return "Les informations de localisation sont indisponibles.";
    case error.TIMEOUT:
      return "La demande d'obtention de la position de l'utilisateur a expiré.";
    default:
      return `Une erreur inconnue est survenue: ${String(error.message)}`;
  }
};

// Function to format coordinates for display
export const formatCoordinates = (coords: { latitude: number; longitude: number }): string => {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
};
