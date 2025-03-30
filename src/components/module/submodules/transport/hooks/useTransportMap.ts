
import { useRef, useState, useCallback } from 'react';
import { MapConfig, MapHookResult, TransportVehicleWithLocation } from '../types/map-types';

// Mock implementation of the map hook
export const useTransportMap = (
  containerRef: React.RefObject<HTMLDivElement>,
  vehicles: TransportVehicleWithLocation[] = []
): MapHookResult => {
  const mapInstanceRef = useRef<any>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Default map configuration
  const [mapConfiguration, setMapConfiguration] = useState<MapConfig>({
    center: [48.8566, 2.3522], // Paris
    zoom: 13,
    tileProvider: 'osm-france',
    showLabels: true,
    centerLat: 48.8566,
    centerLng: 2.3522
  });

  // Function to initialize the map
  const initializeMap = useCallback(() => {
    if (!containerRef.current || !window.L) {
      return;
    }

    // Clean up existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    try {
      // Create map instance
      mapInstanceRef.current = window.L.map(containerRef.current).setView(
        [mapConfiguration.centerLat || mapConfiguration.center[0], mapConfiguration.centerLng || mapConfiguration.center[1]],
        mapConfiguration.zoom
      );

      // Add tile layer based on provider
      let tileLayer;
      switch (mapConfiguration.tileProvider) {
        case 'osm-france':
          tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          });
          break;
        case 'carto':
          tileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          });
          break;
        default: // 'osm'
          tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          });
      }

      tileLayer.addTo(mapInstanceRef.current);

      // Add vehicle markers if showLabels is true
      if (mapConfiguration.showLabels && vehicles.length > 0) {
        vehicles.forEach(vehicle => {
          if (vehicle.location) {
            const { latitude, longitude, lat, lng } = vehicle.location;
            const position = [lat || latitude, lng || longitude];
            
            const marker = window.L.marker(position as [number, number])
              .addTo(mapInstanceRef.current)
              .bindPopup(`
                <b>${vehicle.name}</b><br>
                ${vehicle.licensePlate}<br>
                ${vehicle.location.status}
              `);
          }
        });
      }

      setIsMapInitialized(true);
      setIsMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [containerRef, mapConfiguration, vehicles]);

  // Function to refresh the map
  const refreshMap = useCallback(() => {
    initializeMap();
  }, [initializeMap]);

  // Functions to manipulate the map
  const setCenter = useCallback((coords: [number, number]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(coords);
    }
  }, []);

  const setZoom = useCallback((zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, []);

  const addMarker = useCallback((coords: [number, number], options = {}) => {
    if (!mapInstanceRef.current) return null;
    const marker = window.L.marker(coords, options).addTo(mapInstanceRef.current);
    return marker;
  }, []);

  const removeMarker = useCallback((marker: any) => {
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(marker);
    }
  }, []);

  const drawRoute = useCallback((points: [number, number][], options = {}) => {
    if (!mapInstanceRef.current) return null;
    const polyline = window.L.polyline(points, options).addTo(mapInstanceRef.current);
    return polyline;
  }, []);

  const clearRoute = useCallback((route: any) => {
    if (route && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(route);
    }
  }, []);

  return {
    map: mapInstanceRef.current,
    isLoaded: isMapLoaded,
    setCenter,
    setZoom,
    addMarker,
    removeMarker,
    drawRoute,
    clearRoute,
    mapInitialized: isMapInitialized,
    mapConfig: mapConfiguration,
    setMapConfig: setMapConfiguration,
    refreshMap
  };
};
