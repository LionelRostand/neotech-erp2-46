
import { TransportVehicleWithLocation, normalizeCoordinates } from '../types';

// Format vehicle popup content for map display
export const getVehiclePopupContent = (vehicle: TransportVehicleWithLocation): string => {
  const { name, licensePlate, location } = vehicle;
  const { latitude, longitude } = normalizeCoordinates(location);
  const status = location.status || 'unknown';
  
  return `
    <div class="p-2">
      <h3 class="font-bold">${name}</h3>
      <p>Plaque: ${licensePlate}</p>
      <p>Statut: ${getVehicleStatusText(status)}</p>
      <p>Vitesse: ${location.speed || 0} km/h</p>
      <p>Position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>
      <p>Dernière mise à jour: ${formatTimestamp(location.timestamp)}</p>
    </div>
  `;
};

// Get text representation of vehicle status
export const getVehicleStatusText = (status: string): string => {
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

// Format timestamp for display
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return timestamp || 'Date inconnue';
  }
};

