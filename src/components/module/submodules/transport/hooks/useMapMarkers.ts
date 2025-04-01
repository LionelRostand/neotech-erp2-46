
import { useEffect, useState } from 'react';
import { TransportVehicleWithLocation } from '../types';
import { normalizeCoordinates } from '../utils/map-utils';

// Since we can't import createMarker and updateMarkerPosition directly,
// we'll implement them inline
const createMarker = (vehicle: TransportVehicleWithLocation) => {
  return {
    id: vehicle.id,
    position: normalizeCoordinates(vehicle.location),
    vehicle: vehicle
  };
};

const updateMarkerPosition = (marker: any, location: any) => {
  return {
    ...marker,
    position: normalizeCoordinates(location)
  };
};

export const useMapMarkers = (vehicles: TransportVehicleWithLocation[]) => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Create markers for all vehicles
    const newMarkers = vehicles.map(vehicle => createMarker(vehicle));
    setMarkers(newMarkers);
  }, [vehicles]);

  const updateMarker = (vehicleId: string, location: any) => {
    setMarkers(prev => 
      prev.map(marker => 
        marker.id === vehicleId 
          ? updateMarkerPosition(marker, location)
          : marker
      )
    );
  };

  return { markers, updateMarker };
};
