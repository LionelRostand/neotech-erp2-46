
import { useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { TransportVehicleWithLocation } from '../types';

// Define base64 encoded SVG strings for vehicle markers instead of importing files
const vanIconSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHJ4PSIyIi8+PHBhdGggZD0iTTYgMTZ2Mi41YTIuNSAyLjUgMCAwIDAgMi41IDIuNWgwYTIuNSAyLjUgMCAwIDAgMi41LTIuNVYxNiIvPjxwYXRoIGQ9Ik0xNiAxNnYyLjVhMi41IDIuNSAwIDAgMCAyLjUgMi41aDBhMi41IDIuNSAwIDAgMCAyLjUtMi41VjE2Ii8+PC9zdmc+";
const carIconSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkgMTdjMCAxLjY2LTEuMzQgMy0zIDNoLThjLTEuNjYgMC0zLTEuMzQtMy0zIDAtMS4zIDAtNS40IDAtNy40YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDIgMCAyIC4wMDEgNi4xIDAgNy40eiIvPjxwYXRoIGQ9Ik05IDdWNWMwLTEuMS45LTIgMi0yaDJjMS4xIDAgMiAuOSAyIDJ2MiIvPjxwYXRoIGQ9Ik01IDEwaDEuNSIvPjxwYXRoIGQ9Ik0xNy41IDEwSDE5Ii8+PHBhdGggZD0iTTYuNSAxMyAzIDE3Ii8+PHBhdGggZD0ibTE3LjUgMTMgMy41IDQiLz48cGF0aCBkPSJtMi41IDE3IC41IDQiLz48cGF0aCBkPSJtMjEgMTctLjUgNCIvPjxwYXRoIGQ9Ik02LjUgMkMyLjUgMiAyIDYuNSAyIDYuNSIvPjxwYXRoIGQ9Ik0xNy41IDJjNCAuMDMgNC41IDQuNSA0LjUgNC41Ii8+PHBhdGggZD0iTTguNSAyaDdWNGgtNy41eiIvPjwvc3ZnPg==";
const busIconSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNOCAwdjIiLz48cGF0aCBkPSJNMTYgMHYyIi8+PHBhdGggZD0iTTggMmgzYTkgOSAwIDAgMSA5IDl2N2MwIDEuMTEtLjkgMi0yIDJoLTFhMiAyIDAgMSAxLTQgMEg5YTIgMiAwIDEgMS00IDBINGEyIDIgMCAwIDEtMi0yVjEwYTggOCAwIDAgMSA2LTh6Ii8+PHBhdGggZD0iTTcgMTNoMTAiLz48cGF0aCBkPSJNNSA6aDFhNiA2IDAgMCAxIDYtNmg0YTYgNiAwIDAgMSA2IDZoMSIvPjxyZWN0IHg9IjUiIHk9IDgiIHdpZHRoPSIxNCIgaGVpZ2h0PSI1IiByeD0iMSIvPjwvc3ZnPgo=";
const selectedIconSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI2ZmZTZlNiIvPjxwYXRoIGQ9Im0xOS4wNiA0LjkzLTguMTIgOC4xMi0zLjA0LTMuMDQiLz48L3N2Zz4=";

// Extend window interface for global map references
declare global {
  interface Window {
    map?: L.Map;
    markers?: L.LayerGroup;
    markerClusterGroup?: any;
  }
}

export function useMapMarkers() {
  const markersRef = useRef<L.LayerGroup | null>(null);
  const markerClusterGroupRef = useRef<any>(null);

  const getVehicleIcon = (vehicleType: string, isSelected: boolean) => {
    if (isSelected) {
      return L.icon({
        iconUrl: selectedIconSvg,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });
    }

    let iconUrl = carIconSvg;
    if (vehicleType.toLowerCase().includes('van')) {
      iconUrl = vanIconSvg;
    } else if (vehicleType.toLowerCase().includes('bus')) {
      iconUrl = busIconSvg;
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
      // Fix: Cast to any to avoid TypeScript errors with markerClusterGroup
      markerClusterGroupRef.current = (L as any).markerClusterGroup({
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
      if (useCluster && markerClusterGroupRef.current) {
        markerClusterGroupRef.current.addLayer(marker);
      } else if (markersRef.current) {
        markersRef.current.addLayer(marker);
      }
    });
    
    // Add the group to the map
    if (useCluster && markerClusterGroupRef.current) {
      map.addLayer(markerClusterGroupRef.current);
    } else if (markersRef.current) {
      map.addLayer(markersRef.current);
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
