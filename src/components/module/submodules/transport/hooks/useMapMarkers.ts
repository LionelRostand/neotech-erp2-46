
import { useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { TransportVehicleWithLocation } from '../types';
import vanIcon from '../assets/van-marker.svg';
import carIcon from '../assets/car-marker.svg';
import busIcon from '../assets/bus-marker.svg';
import selectedIcon from '../assets/selected-marker.svg';

declare global {
  interface Window {
    map?: L.Map;
    markers?: L.LayerGroup;
    markerClusterGroup?: L.MarkerClusterGroup;
  }
}

export function useMapMarkers() {
  const markersRef = useRef<L.LayerGroup | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  const getVehicleIcon = (vehicleType: string, isSelected: boolean) => {
    if (isSelected) {
      return L.icon({
        iconUrl: selectedIcon,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });
    }

    let iconUrl = carIcon;
    if (vehicleType.toLowerCase().includes('van')) {
      iconUrl = vanIcon;
    } else if (vehicleType.toLowerCase().includes('bus')) {
      iconUrl = busIcon;
    }

    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const clearMarkers = useCallback((map?: L.Map) => {
    if (!map && typeof window !== 'undefined') {
      map = window.map;
    }

    if (markersRef.current && map) {
      map.removeLayer(markersRef.current);
      markersRef.current = null;
    }

    if (markerClusterGroupRef.current && map) {
      map.removeLayer(markerClusterGroupRef.current);
      markerClusterGroupRef.current = null;
    }
  }, []);

  const addVehicleMarkers = useCallback((
    map: L.Map, 
    vehicles: TransportVehicleWithLocation[], 
    onVehicleSelect: (vehicle: TransportVehicleWithLocation) => void,
    selectedId?: string,
    useCluster = true
  ) => {
    if (!map) return;

    // Clear existing markers
    clearMarkers(map);

    // Create the marker group
    if (useCluster) {
      markerClusterGroupRef.current = L.markerClusterGroup({
        maxClusterRadius: 30,
        disableClusteringAtZoom: 15,
      });
    } else {
      markersRef.current = L.layerGroup();
    }

    // Add markers for each vehicle
    vehicles.forEach(vehicle => {
      const { location } = vehicle;
      const isSelected = vehicle.id === selectedId;
      const icon = getVehicleIcon(vehicle.type, isSelected);
      
      const marker = L.marker([location.latitude, location.longitude], {
        icon,
        title: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
        riseOnHover: true,
      });
      
      marker.on('click', () => onVehicleSelect(vehicle));
      
      // Add the marker to the appropriate group
      if (useCluster) {
        markerClusterGroupRef.current?.addLayer(marker);
      } else {
        markersRef.current?.addLayer(marker);
      }
    });
    
    // Add the group to the map
    if (useCluster) {
      markerClusterGroupRef.current && map.addLayer(markerClusterGroupRef.current);
    } else {
      markersRef.current && map.addLayer(markersRef.current);
    }
    
    // Store references globally for debugging
    if (typeof window !== 'undefined') {
      window.markers = markersRef.current;
      window.markerClusterGroup = markerClusterGroupRef.current;
    }
  }, [clearMarkers]);

  return {
    clearMarkers,
    addVehicleMarkers
  };
}
