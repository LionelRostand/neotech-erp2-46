
import { VehicleLocation, Coordinates, MapMarker, TransportVehicleWithLocation } from '../types';

// Normalize coordinates to [longitude, latitude] format
export function normalizeCoordinates(location: VehicleLocation | Coordinates): [number, number] {
  if ('coordinates' in location) {
    // It's a VehicleLocation
    return [location.coordinates.longitude, location.coordinates.latitude];
  }
  // It's a Coordinates object
  return [location.longitude, location.latitude];
}

// Create a marker from a vehicle
export function createMarker(vehicle: TransportVehicleWithLocation): MapMarker {
  return {
    id: vehicle.id,
    position: normalizeCoordinates(vehicle.location),
    type: 'vehicle',
    status: vehicle.status,
    title: vehicle.name
  };
}

// Update marker position
export function updateMarkerPosition(marker: MapMarker, location: VehicleLocation | Coordinates): MapMarker {
  return {
    ...marker,
    position: normalizeCoordinates(location)
  };
}

// Generate vehicle popup content
export function getVehiclePopupContent(vehicle: TransportVehicleWithLocation): string {
  const { name, licensePlate, status, location } = vehicle;
  return `
    <div class="p-3">
      <h3 class="font-bold mb-1">${name}</h3>
      <p class="text-sm mb-1">Plaque: ${licensePlate}</p>
      <p class="text-sm mb-1">Statut: ${status}</p>
      <p class="text-sm mb-1">Vitesse: ${location.speed || 0} km/h</p>
      <p class="text-sm text-muted-foreground">Dernière mise à jour: 
        ${new Date(location.timestamp).toLocaleString('fr-FR')}
      </p>
    </div>
  `;
}

// Generate tracking marker HTML for different statuses
export function getTrackingMarkerHtml(status: string): string {
  const statusColors: Record<string, string> = {
    'delivered': 'bg-green-500',
    'in_transit': 'bg-blue-500',
    'processing': 'bg-amber-500',
    'registered': 'bg-purple-500',
    'out_for_delivery': 'bg-cyan-500',
    'delayed': 'bg-orange-500',
    'exception': 'bg-red-500',
    'returned': 'bg-gray-500'
  };
  
  const color = statusColors[status] || 'bg-gray-400';
  
  return `<div class="w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
    <div class="w-6 h-6 rounded-full ${color}"></div>
  </div>`;
}
