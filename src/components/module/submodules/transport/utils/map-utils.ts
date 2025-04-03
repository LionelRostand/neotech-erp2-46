
import { TransportVehicleWithLocation, Coordinates, VehicleLocation } from '../types';

// Normalize coordinates from different possible formats
export const normalizeCoordinates = (location: any): Coordinates => {
  if (!location) return { latitude: 0, longitude: 0 };
  
  // If location already has coordinates in the right format
  if (location.coordinates && typeof location.coordinates === 'object') {
    const { latitude, longitude } = location.coordinates;
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      return { latitude, longitude };
    }
  }
  
  // If location has lat/lng format
  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return {
      latitude: location.lat,
      longitude: location.lng
    };
  }
  
  // If location has latitude/longitude directly
  if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    return {
      latitude: location.latitude,
      longitude: location.longitude
    };
  }
  
  return { latitude: 0, longitude: 0 };
};

export const getVehiclePopupContent = (vehicle: TransportVehicleWithLocation): string => {
  const location = vehicle.location;
  const status = location.status || 'unknown';
  
  let address = '';
  if (location && typeof location === 'object') {
    if ('address' in location && location.address) {
      address = location.address;
    } else {
      const coords = normalizeCoordinates(location);
      address = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
    }
  }
  
  const driverInfo = vehicle.driverName ? `<br/><b>Chauffeur:</b> ${vehicle.driverName}` : '';
  
  return `
    <div>
      <h3 class="font-bold">${vehicle.name}</h3>
      <p><b>Statut:</b> ${status}</p>
      <p><b>Emplacement:</b> ${address}</p>
      ${driverInfo}
      <p><b>Vitesse:</b> ${location.speed || 0} km/h</p>
    </div>
  `;
};

export const getMapBounds = (locations: any[]): any => {
  if (!locations || locations.length === 0) {
    return null;
  }
  
  const bounds = {
    north: -90,
    south: 90,
    east: -180,
    west: 180
  };
  
  locations.forEach(loc => {
    const coords = normalizeCoordinates(loc);
    
    if (coords.latitude > bounds.north) bounds.north = coords.latitude;
    if (coords.latitude < bounds.south) bounds.south = coords.latitude;
    if (coords.longitude > bounds.east) bounds.east = coords.longitude;
    if (coords.longitude < bounds.west) bounds.west = coords.longitude;
  });
  
  return bounds;
};
