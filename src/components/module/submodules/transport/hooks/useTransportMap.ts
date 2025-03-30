
import { useState, useEffect, useRef } from 'react';
import { MapConfig, TransportVehicleWithLocation, MapHookResult } from '../types';

// Default map configuration
const DEFAULT_CONFIG: MapConfig = {
  center: [48.866667, 2.333333], // Paris
  zoom: 13,
  style: 'mapbox://styles/mapbox/streets-v11',
  minZoom: 3,
  maxZoom: 18,
  showLabels: true
};

export const useTransportMap = (initialConfig?: Partial<MapConfig>): MapHookResult => {
  // Combine default config with any provided config
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig
  });
  
  // Create refs and state
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Initialize the map
  useEffect(() => {
    if (mapContainerRef.current && !mapInitialized) {
      const initializeMap = async () => {
        try {
          // Dynamic import to avoid SSR issues
          const mapboxgl = (await import('mapbox-gl')).default;
          
          // Set mapbox token (in a real app, this would be from env vars)
          mapboxgl.accessToken = 'pk.YOUR_MAPBOX_TOKEN_HERE';
          
          // Create the map
          const mapInstance = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: mapConfig.style || DEFAULT_CONFIG.style,
            center: mapConfig.center,
            zoom: mapConfig.zoom,
            minZoom: mapConfig.minZoom,
            maxZoom: mapConfig.maxZoom
          });
          
          // Setup event listeners
          mapInstance.on('load', () => {
            setMap(mapInstance);
            setIsLoaded(true);
            setMapInitialized(true);
            console.log('Map initialized');
          });
          
          mapInstance.on('error', (e) => {
            console.error('Mapbox error:', e);
          });
          
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };
      
      initializeMap();
    }
  }, [mapContainerRef, mapInitialized, mapConfig]);
  
  // Add markers to the map
  const addMarkers = (vehicles: TransportVehicleWithLocation[]) => {
    if (!map) return;
    
    // Clear existing markers
    // In a real implementation, you would track and remove existing markers
    
    vehicles.forEach(vehicle => {
      if (vehicle.location) {
        try {
          // Create marker
          new mapboxgl.Marker()
            .setLngLat([vehicle.location.longitude, vehicle.location.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h3>${vehicle.name}</h3>
                  <p>${vehicle.licensePlate}</p>
                  <p>Status: ${vehicle.status}</p>
                `)
            )
            .addTo(map);
        } catch (error) {
          console.error(`Error adding marker for vehicle ${vehicle.id}:`, error);
        }
      }
    });
  };
  
  // Center the map on a vehicle
  const centerOnVehicle = (vehicleId: string) => {
    // In a real app, you would look up the vehicle and center the map
    console.log(`Centering on vehicle ${vehicleId}`);
  };
  
  // Set the center of the map
  const setCenter = (center: [number, number]) => {
    if (map) {
      map.setCenter(center);
      setMapConfig(prev => ({ ...prev, center }));
    }
  };
  
  // Set the zoom level
  const setZoom = (zoom: number) => {
    if (map) {
      map.setZoom(zoom);
      setMapConfig(prev => ({ ...prev, zoom }));
    }
  };
  
  // Refresh the map
  const refreshMap = () => {
    if (map) {
      map.resize();
    }
  };
  
  return {
    mapRef: mapContainerRef,
    isLoaded,
    addMarkers, // Corrected from addMarker to addMarkers
    centerOnVehicle,
    refreshMap,
    map,
    mapInitialized,
    mapConfig,
    setMapConfig,
    setCenter,
    setZoom
  };
};
