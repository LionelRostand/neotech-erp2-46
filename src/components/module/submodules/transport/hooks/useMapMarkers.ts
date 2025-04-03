
import { useEffect, useState } from 'react';
import { TransportVehicleWithLocation } from '../types';
import { normalizeCoordinates } from '../utils/map-utils';

export const useMapMarkers = (vehicles: TransportVehicleWithLocation[]) => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Create markers for all vehicles
    const newMarkers = vehicles.map(vehicle => {
      const location = vehicle.location;
      const normalizedPosition = 'coordinates' in location 
        ? location.coordinates
        : { latitude: location.lat, longitude: location.lng };
        
      return {
        id: vehicle.id,
        position: normalizedPosition,
        type: 'vehicle',
        status: location.status || 'unknown',
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
          ? { 
              ...marker, 
              position: 'coordinates' in location 
                ? location.coordinates
                : { latitude: location.lat, longitude: location.lng }
            }
          : marker
      )
    );
  };

  return { markers, updateMarker };
};
