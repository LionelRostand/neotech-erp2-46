
import { useRef } from 'react';
import { MapConfig, TransportVehicleWithLocation } from '../types/map-types';
import { getMarkerColorByStatus } from '../utils/map-utils';

export const useMapMarkers = () => {
  const markersRef = useRef<any[]>([]);
  
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];
  };
  
  const createVehicleMarkers = async (
    map: any,
    vehicles: TransportVehicleWithLocation[],
    showLabels: boolean
  ) => {
    if (!map) return [];
    
    // Clear existing markers
    clearMarkers();
    
    // Dynamic import to avoid SSR issues
    const L = await import('leaflet');
    
    // Add new markers
    const vehiclesWithLocation = vehicles.filter(v => v.location);
    const markers: any[] = [];
    
    vehiclesWithLocation.forEach(vehicle => {
      if (vehicle.location) {
        const { lat, lng } = vehicle.location;
        
        // Create custom icon based on vehicle status
        const iconColor = getMarkerColorByStatus(vehicle.location.status);
        
        const customIcon = L.divIcon({
          className: `vehicle-marker-${vehicle.id}`,
          html: `<div style="background-color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%;"></div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
        
        const marker = L.marker([lat, lng], { icon: customIcon });
        
        // Create popup for vehicle info
        const popupContent = showLabels 
          ? `
            <div>
              <h3 style="font-weight: bold; margin-bottom: 5px;">${vehicle.name}</h3>
              <p style="margin-bottom: 3px;">Immatriculation: ${vehicle.licensePlate}</p>
              <p style="margin-bottom: 3px;">Statut: ${vehicle.location.status}</p>
              <p style="margin-bottom: 3px;">Vitesse: ${vehicle.location.speed} km/h</p>
              <p style="margin-bottom: 3px;">Dernière mise à jour: ${new Date(vehicle.location.lastUpdate).toLocaleTimeString('fr-FR')}</p>
            </div>
          `
          : `<div><p>${vehicle.name}</p></div>`;
        
        marker.bindPopup(popupContent);
        
        marker.addTo(map);
        markers.push(marker);
      }
    });
    
    markersRef.current = markers;
    return markers;
  };
  
  const fitMapToMarkers = (map: any, markers: any[]) => {
    if (!map || markers.length === 0) return;
    
    try {
      // Dynamic import to avoid SSR issues
      import('leaflet').then(L => {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
      });
    } catch (error) {
      console.error("Error fitting bounds", error);
    }
  };
  
  return {
    markersRef,
    createVehicleMarkers,
    fitMapToMarkers,
    clearMarkers
  };
};
