
import { useEffect, useRef, useState } from 'react';
import { TransportVehicleWithLocation, MapConfig, MapHookResult } from '../types/map-types';
import { configureLeafletIcons } from '../utils/leaflet-icon-setup';
import { getTileLayerConfig, calculateMapCenter } from '../utils/map-utils';
import { useMapMarkers } from './useMapMarkers';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

export const useTransportMap = (
  mapElementRef: React.RefObject<HTMLDivElement>,
  vehicles: TransportVehicleWithLocation[],
  initialConfig?: Partial<MapConfig>
): MapHookResult => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const leafletMapRef = useRef<any>(null);
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    zoom: 11,
    centerLat: 48.852969,
    centerLng: 2.349903,
    tileProvider: 'osm-france',
    showLabels: true,
    ...initialConfig
  });
  
  // Added to prevent continuous reloading
  const initializationAttemptedRef = useRef(false);
  const { markersRef, createVehicleMarkers, fitMapToMarkers } = useMapMarkers();

  // Initialize and update map when vehicles or config change
  useEffect(() => {
    if (!mapElementRef.current) return;
    
    // Prevent repeated initialization attempts
    if (!mapInitialized && initializationAttemptedRef.current) return;
    
    const initializeMap = async () => {
      try {
        // Set initialization flag to prevent multiple attempts
        initializationAttemptedRef.current = true;
        
        // Configure Leaflet icons
        const L = await configureLeafletIcons();
        
        // Initialize map if not already done
        if (!mapInitialized) {
          // Clean up existing map
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
            leafletMapRef.current = null;
          }
          
          // Calculate center position
          const { latitude, longitude, zoom } = calculateMapCenter(
            vehicles,
            mapConfig.centerLat,
            mapConfig.centerLng,
            mapConfig.zoom
          );
          
          // Create new map with correct sizing and options
          const map = L.map(mapElementRef.current, {
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            maxBounds: [[-90, -180], [90, 180]]
          }).setView([latitude, longitude], zoom);
          
          leafletMapRef.current = map;
          
          // Add tile layer based on config
          const tileLayerConfig = getTileLayerConfig(mapConfig.tileProvider);
          const tileLayer = L.tileLayer(tileLayerConfig.url, tileLayerConfig);
          tileLayer.addTo(map);
          
          // Ensure map properly sizes itself - critical for proper display
          setTimeout(() => {
            map.invalidateSize(true);
          }, 500);

          setMapInitialized(true);
        }
        
        // Add or update markers for all vehicles with location
        if (mapInitialized && leafletMapRef.current) {
          // Force map to update its container size again after initialization
          leafletMapRef.current.invalidateSize(true);
          
          // Create new markers
          const markers = await createVehicleMarkers(
            leafletMapRef.current, 
            vehicles, 
            mapConfig.showLabels
          );
          
          // Fit map to show all markers
          fitMapToMarkers(leafletMapRef.current, markers);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [vehicles, mapInitialized, mapElementRef, mapConfig, createVehicleMarkers, fitMapToMarkers]);

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const forceRefreshMap = () => {
    // Reset the initialization flag
    initializationAttemptedRef.current = false;
    setMapInitialized(false);
  };

  return { 
    mapInitialized,
    mapConfig,
    setMapConfig,
    refreshMap: forceRefreshMap
  };
};
