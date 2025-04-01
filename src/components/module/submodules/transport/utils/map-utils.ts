
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
