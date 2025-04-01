
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { TransportVehicleWithLocation } from '../types/transport-types';
import { normalizeCoordinates, createMarker, updateMarkerPosition } from '../utils/map-utils';

interface UseMapMarkersProps {
  map: L.Map | null;
  vehicles: TransportVehicleWithLocation[];
  onMarkerClick?: (vehicle: TransportVehicleWithLocation) => void;
}

export const useMapMarkers = ({ map, vehicles, onMarkerClick }: UseMapMarkersProps) => {
  const [markers, setMarkers] = useState<Record<string, L.Marker>>({});
  const [markersLayer, setMarkersLayer] = useState<L.LayerGroup | null>(null);

  // Initialize markers layer
  useEffect(() => {
    if (map && !markersLayer) {
      const layer = L.layerGroup().addTo(map);
      setMarkersLayer(layer);
      return () => {
        map.removeLayer(layer);
      };
    }
  }, [map, markersLayer]);

  // Create/update markers when vehicles change
  useEffect(() => {
    if (!map || !markersLayer) return;

    // Track current markers to remove those that are no longer needed
    const currentMarkers: Record<string, boolean> = {};
    
    vehicles.forEach(vehicle => {
      const coords = normalizeCoordinates(vehicle.location);
      currentMarkers[vehicle.id] = true;

      if (markers[vehicle.id]) {
        // Update existing marker
        updateMarkerPosition(markers[vehicle.id], vehicle.location);
      } else {
        // Create new marker
        const marker = createMarker(vehicle.location, vehicle, onMarkerClick);
        marker.addTo(markersLayer);
        setMarkers(prev => ({
          ...prev,
          [vehicle.id]: marker
        }));
      }
    });

    // Remove markers for vehicles that are no longer in the list
    Object.keys(markers).forEach(vehicleId => {
      if (!currentMarkers[vehicleId]) {
        markersLayer.removeLayer(markers[vehicleId]);
        setMarkers(prev => {
          const updated = { ...prev };
          delete updated[vehicleId];
          return updated;
        });
      }
    });
  }, [map, markersLayer, vehicles, markers, onMarkerClick]);

  return { markers };
};

export default useMapMarkers;
