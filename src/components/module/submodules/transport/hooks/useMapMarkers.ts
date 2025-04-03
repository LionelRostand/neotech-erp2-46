
import { useEffect, useState } from 'react';
import { TransportVehicleWithLocation, Coordinates } from '../types';

export const useMapMarkers = (vehicles: TransportVehicleWithLocation[]) => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Create markers for all vehicles
    const newMarkers = vehicles.map(vehicle => {
      const location = vehicle.location;
      let normalizedPosition: Coordinates;
      
      // Access the coordinates based on the available structure
      if ('coordinates' in location && location.coordinates) {
        normalizedPosition = location.coordinates;
      } else if ('lat' in location && 'lng' in location) {
        normalizedPosition = { 
          latitude: (location as any).lat, 
          longitude: (location as any).lng 
        };
      } else {
        // Default fallback position
        normalizedPosition = { latitude: 0, longitude: 0 };
      }
        
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
                : { 
                    latitude: (location as any).lat || 0, 
                    longitude: (location as any).lng || 0 
                  }
            }
          : marker
      )
    );
  };

  return { markers, updateMarker };
};
