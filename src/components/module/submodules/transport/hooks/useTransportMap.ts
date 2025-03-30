import { useState, useEffect, useRef } from 'react';
import { TransportVehicleWithLocation, MapConfig, MapHookResult } from '../types/map-types';
import { getTileLayerConfig, calculateMapCenter } from '../utils/map-utils';
import { useMapMarkers } from './useMapMarkers';
import { configureLeafletIcons } from '../utils/leaflet-icon-setup';
import 'mapbox-gl/dist/mapbox-gl.css';
// Remove the mapboxgl import as we don't need it for Leaflet

const DEFAULT_CENTER_LAT = 48.8566;
const DEFAULT_CENTER_LNG = 2.3522;
const DEFAULT_ZOOM = 12;

export const useTransportMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  vehicles: TransportVehicleWithLocation[]
): MapHookResult => {
  const [map, setMap] = useState<any>(null);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  const { createVehicleMarkers, fitMapToMarkers, clearMarkers } = useMapMarkers();
  
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: [DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG],
    zoom: DEFAULT_ZOOM,
    tileProvider: 'osm-france',
    showLabels: true,
  });
  
  // Use refs to store callbacks that need to access current state/props
  const markersRef = useRef<any[]>([]);
  const vehiclesRef = useRef(vehicles);
  
  // Update ref when vehicles change
  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);
  
  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInitialized) return;
      
      try {
        // Configure Leaflet correctly
        const L = await configureLeafletIcons();
        
        // Calculate optimal center and zoom based on vehicle positions
        const { latitude, longitude, zoom } = calculateMapCenter(
          vehicles,
          DEFAULT_CENTER_LAT,
          DEFAULT_CENTER_LNG,
          DEFAULT_ZOOM
        );
        
        // Get tile layer config based on provider
        const tileLayerConfig = getTileLayerConfig(mapConfig.tileProvider);
        
        // Create map instance
        const mapInstance = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          minZoom: tileLayerConfig.minZoom,
          maxZoom: tileLayerConfig.maxZoom,
          zoomControl: false,
        });
        
        // Add tile layer
        L.tileLayer(tileLayerConfig.url, {
          attribution: tileLayerConfig.attribution,
        }).addTo(mapInstance);
        
        // Add zoom control in the top-right corner
        L.control.zoom({ position: 'topright' }).addTo(mapInstance);
        
        // Add scale control
        L.control.scale({ imperial: false }).addTo(mapInstance);
        
        setMap(mapInstance);
        setMapInitialized(true);
        setIsLoaded(true);
        
        // Add markers for vehicles - fixed parameter order for createVehicleMarkers
        const markers = await createVehicleMarkers(mapInstance, vehicles);
        markersRef.current = markers;
        
        // Fit map to markers
        if (markers.length > 0) {
          fitMapToMarkers(mapInstance, markers);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initMap();
    
    // Cleanup on unmount
    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setMapInitialized(false);
        setIsLoaded(false);
      }
    };
  }, [mapRef, mapInitialized]);
  
  // Update markers when vehicles change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!map || !mapInitialized) return;
      
      clearMarkers();
      // Fixed parameter order for createVehicleMarkers
      const markers = await createVehicleMarkers(map, vehicles);
      markersRef.current = markers;
    };
    
    updateMarkers();
  }, [vehicles, mapInitialized, map, clearMarkers, createVehicleMarkers]);
  
  // Update map when config changes
  useEffect(() => {
    if (!map) return;
    
    // Update center and zoom
    map.setView(mapConfig.center, mapConfig.zoom);
    
  }, [map, mapConfig.center, mapConfig.zoom]);
  
  // Function to add markers
  const addMarkers = (vehicles: TransportVehicleWithLocation[]) => {
    if (!map || !mapInitialized) return;
    
    createVehicleMarkers(map, vehicles);
  };
  
  // Function to center on specific vehicle
  const centerOnVehicle = (vehicleId: string) => {
    if (!map) return;
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.location) {
      map.setView([vehicle.location.lat, vehicle.location.lng], mapConfig.zoom);
    }
  };
  
  // Function to refresh map
  const refreshMap = () => {
    if (!mapRef.current) return;
    
    // Destroy existing map
    if (map) {
      map.remove();
      setMap(null);
      setMapInitialized(false);
    }
    
    // Re-initialize map
    setMapInitialized(false);
  };
  
  // Function to set center
  const setCenter = (coords: [number, number]) => {
    setMapConfig(prev => ({ ...prev, center: coords }));
  };
  
  // Function to set zoom
  const setZoom = (zoom: number) => {
    setMapConfig(prev => ({ ...prev, zoom }));
  };
  
  return {
    mapRef,
    isLoaded,
    map,
    mapConfig,
    mapInitialized,
    addMarkers,
    centerOnVehicle,
    refreshMap,
    setMapConfig,
    setCenter,
    setZoom,
  };
};
