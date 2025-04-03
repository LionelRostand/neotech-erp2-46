
import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

export const useMapMarkers = (locations: Array<{ coordinates: any; id: string; [key: string]: any }>) => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (!locations || locations.length === 0) return;

    const formattedMarkers = locations.map(location => {
      // Handle different coordinate formats and normalize them
      const coords: Coordinates = {
        lat: location.coordinates.lat || location.coordinates.latitude || 0,
        lng: location.coordinates.lng || location.coordinates.longitude || 0
      };

      return {
        id: location.id,
        position: coords,
        ...location
      };
    });

    setMarkers(formattedMarkers);
  }, [locations]);

  return markers;
};

export default useMapMarkers;
