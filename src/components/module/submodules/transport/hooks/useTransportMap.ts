
import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { useMapMarkers } from './useMapMarkers';
import { MapConfig, TransportVehicleWithLocation, MapHookResult } from '../types';

// Default map configuration
const defaultConfig: MapConfig = {
  center: [48.866667, 2.333333], // Paris
  zoom: 12,
  maxZoom: 18,
  minZoom: 3,
  tileProvider: 'osm', // OpenStreetMap by default
};

export function useTransportMap(initialConfig?: MapConfig): MapHookResult {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapConfig, setMapConfig] = useState<MapConfig>(initialConfig || defaultConfig);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { clearMarkers, addVehicleMarkers } = useMapMarkers();

  // Initialize the map when the component mounts
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Create the map
    const mapInstance = L.map(mapRef.current, {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      maxZoom: mapConfig.maxZoom || 18,
      minZoom: mapConfig.minZoom || 3,
    });

    // Add the tile layer
    const tileProvider = mapConfig.tileProvider || 'osm';
    let tileLayer: L.TileLayer;

    if (tileProvider === 'osm') {
      tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });
    } else if (tileProvider === 'mapbox') {
      const options: L.TileLayerOptions = {
        attribution: '&copy; Mapbox',
        id: 'mapbox/streets-v11'
      };
      
      // Using environment variable safely
      const accessToken = process.env.MAPBOX_ACCESS_TOKEN || 'your-mapbox-access-token';
      
      tileLayer = L.tileLayer(
        `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, 
        options
      );
    } else {
      tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });
    }

    tileLayer.addTo(mapInstance);
    setMap(mapInstance);
    setMapInitialized(true);

    // Cleanup function
    return () => {
      mapInstance.remove();
      setMap(null);
      setMapInitialized(false);
    };
  }, []);

  // Update the map when the configuration changes
  useEffect(() => {
    if (!map) return;

    map.setView(mapConfig.center, mapConfig.zoom);
    
    // Set tile layer based on provider if it changed
    if (mapConfig.tileProvider) {
      // Here we would need to remove the old layer and add a new one
      // but for simplicity, we're just updating the view
    }
    
  }, [map, mapConfig]);

  // Function to clear and update markers
  const updateMarkers = useCallback((vehicles: TransportVehicleWithLocation[], selectedId?: string) => {
    if (!map) return;
    
    clearMarkers(map);
    addVehicleMarkers(map, vehicles, () => {}, selectedId);
  }, [map, clearMarkers, addVehicleMarkers]);

  // Function to refresh the map
  const refreshMap = useCallback(() => {
    if (!map) return;
    
    map.invalidateSize();
  }, [map]);

  return {
    mapRef,
    mapInitialized,
    setMapConfig,
    refreshMap,
    updateMarkers,
    mapConfig
  };
}
