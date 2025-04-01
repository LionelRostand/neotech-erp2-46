
import { useEffect, useState } from 'react';
import { TransportVehicleWithLocation } from '../types';
import { normalizeCoordinates, createMarker, updateMarkerPosition } from '../utils/map-utils';

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
