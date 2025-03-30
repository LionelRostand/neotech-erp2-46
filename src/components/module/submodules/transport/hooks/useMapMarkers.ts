
import { useCallback } from 'react';
import { TransportVehicleWithLocation } from '../types/map-types';
import { getMarkerColorByStatus } from '../utils/map-utils';

export const useMapMarkers = () => {
  const createVehicleMarkers = useCallback(async (map: any, vehicles: TransportVehicleWithLocation[], showLabels: boolean = true) => {
    if (!map) return [];
    
    try {
      // Import Leaflet dynamically
      const L = await import('leaflet');
      
      const markers: any[] = [];
      
      vehicles.forEach(vehicle => {
        if (!vehicle.location) return;
        
        const { lat, lng } = vehicle.location;
        if (!lat || !lng) return;
        
        // Create marker with custom icon
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-vehicle-marker',
            html: `<div style="background-color: ${getMarkerColorByStatus(vehicle.location.status || '')}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).addTo(map);
        
        // Add popup with vehicle info
        marker.bindPopup(`
          <div>
            <b>${vehicle.name}</b><br/>
            ${vehicle.licensePlate}<br/>
            ${vehicle.location.status || 'Status inconnu'}<br/>
            ${vehicle.driverName ? `Chauffeur: ${vehicle.driverName}` : 'Aucun chauffeur'}
          </div>
        `);
        
        markers.push(marker);
      });
      
      return markers;
    } catch (error) {
      console.error("Error creating markers:", error);
      return [];
    }
  }, []);
  
  const clearMarkers = useCallback(() => {
    // This would be implemented to remove existing markers
    // Left empty as it would depend on how markers are stored
  }, []);
  
  const fitMapToMarkers = useCallback((map: any, markers: any[]) => {
    if (!map || markers.length === 0) return;
    
    try {
      // Use dynamic import instead of require
      import('leaflet').then((L) => {
        const bounds = L.latLngBounds();
        
        markers.forEach(marker => {
          bounds.extend(marker.getLatLng());
        });
        
        map.fitBounds(bounds, { padding: [50, 50] });
      }).catch(error => {
        console.error("Error importing Leaflet:", error);
      });
    } catch (error) {
      console.error("Error fitting map to markers:", error);
    }
  }, []);
  
  return {
    createVehicleMarkers,
    clearMarkers,
    fitMapToMarkers
  };
};
