
import { useCallback } from 'react';
import L from 'leaflet';
import { TransportVehicleWithLocation } from '../types';

export function useMapMarkers() {
  // Store markers for cleanup
  const markers: L.Marker[] = [];
  
  // Clear all markers from the map
  const clearMarkers = useCallback((map: L.Map) => {
    markers.forEach(marker => {
      map.removeLayer(marker);
    });
    markers.length = 0;
  }, []);
  
  // Add vehicle markers to the map
  const addVehicleMarkers = useCallback((
    map: L.Map, 
    vehicles: TransportVehicleWithLocation[], 
    onMarkerClick: (vehicleId: string) => void,
    selectedVehicleId?: string
  ) => {
    vehicles.forEach(vehicle => {
      if (!vehicle.location) return;
      
      const { lat, lng } = vehicle.location;
      if (!lat || !lng) return;
      
      // Create marker options
      const markerOptions: L.MarkerOptions = {
        icon: createVehicleIcon(vehicle.type, selectedVehicleId === vehicle.id),
        title: vehicle.name || vehicle.licensePlate
      };
      
      // Create and add marker
      const marker = L.marker([lat, lng], markerOptions).addTo(map);
      
      // Add click handler
      marker.on('click', () => {
        onMarkerClick(vehicle.id);
      });
      
      // Store marker for later cleanup
      markers.push(marker);
    });
  }, []);
  
  return { clearMarkers, addVehicleMarkers };
}

// Helper function to create vehicle icon
function createVehicleIcon(vehicleType?: string, isSelected = false): L.DivIcon {
  const iconSize = isSelected ? 36 : 32;
  const borderClass = isSelected ? 'border-2 border-blue-500' : '';
  let bgColor = 'bg-blue-500';
  
  switch (vehicleType) {
    case 'sedan':
      bgColor = 'bg-blue-500';
      break;
    case 'suv':
      bgColor = 'bg-green-500';
      break;
    case 'van':
      bgColor = 'bg-amber-500';
      break;
    case 'luxury':
      bgColor = 'bg-purple-500';
      break;
    default:
      bgColor = 'bg-gray-500';
  }
  
  return L.divIcon({
    className: `rounded-full ${bgColor} ${borderClass} flex items-center justify-center shadow-lg`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize/2],
    html: `<div class="text-white text-xs font-bold">${vehicleType?.charAt(0).toUpperCase() || 'V'}</div>`
  });
}
