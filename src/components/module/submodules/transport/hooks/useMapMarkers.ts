
import { useEffect, useState } from 'react';
import { TransportVehicleWithLocation } from '../types';
import { normalizeCoordinates } from '../utils/map-utils';

export const useMapMarkers = (vehicles: TransportVehicleWithLocation[]) => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Create markers for all vehicles
    const newMarkers = vehicles.map(vehicle => {
      const normalizedPosition = normalizeCoordinates(vehicle.location);
      return {
        id: vehicle.id,
        position: normalizedPosition,
        type: 'vehicle',
        status: vehicle.status,
        title: vehicle.name,
        vehicle: vehicle // Store the complete vehicle for popups
      };
    });
    setMarkers(newMarkers);
  }, [vehicles]);

  const updateMarker = (vehicleId: string, location: any) => {
    setMarkers(prev => 
      prev.map(marker => 
        marker.id === vehicleId 
          ? { ...marker, position: normalizeCoordinates(location) }
          : marker
      )
    );
  };

  return { markers, updateMarker };
};
