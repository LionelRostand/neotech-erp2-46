
import { useRef, useCallback } from 'react';
import L from 'leaflet';
import { TransportVehicleWithLocation, Coordinates } from '../types/transport-types';
import { normalizeCoordinates } from '../utils/map-utils';

export function useTransportMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const initializeMap = useCallback((): L.Map | null => {
    if (!mapContainer.current) return null;
    if (mapInstance.current) return mapInstance.current;

    // Default center coordinates (Paris)
    const defaultCoordinates: Coordinates = {
      latitude: 48.8566,
      longitude: 2.3522
    };

    // Create map
    const map = L.map(mapContainer.current).setView(
      [defaultCoordinates.latitude, defaultCoordinates.longitude], 
      13
    );

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create markers layer
    const markers = L.layerGroup().addTo(map);
    markersLayer.current = markers;

    // Store map instance
    mapInstance.current = map;

    return map;
  }, []);

  const addVehiclesToMap = useCallback(
    (
      vehicles: TransportVehicleWithLocation[], 
      onVehicleClick?: (vehicle: TransportVehicleWithLocation) => void
    ) => {
      if (!mapInstance.current || !markersLayer.current) return;

      // Clear existing markers
      markersLayer.current.clearLayers();

      // Add new markers
      vehicles.forEach(vehicle => {
        const coords = normalizeCoordinates(vehicle.location);
        
        // Create marker
        const marker = L.marker([coords.lat, coords.lng]);
        
        // Add popup
        marker.bindPopup(`
          <div>
            <h3>${vehicle.name}</h3>
            <p>${vehicle.licensePlate}</p>
            <p>Status: ${vehicle.location.status}</p>
          </div>
        `);
        
        // Add click handler
        if (onVehicleClick) {
          marker.on('click', () => onVehicleClick(vehicle));
        }
        
        // Add to layer
        marker.addTo(markersLayer.current!);
      });
      
      // If we have vehicles, fit bounds
      if (vehicles.length > 0) {
        const bounds = L.latLngBounds(
          vehicles.map(v => {
            const coords = normalizeCoordinates(v.location);
            return [coords.lat, coords.lng];
          })
        );
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    },
    []
  );

  const centerOnCoordinates = useCallback((coordinates: Coordinates, zoom: number = 15) => {
    if (!mapInstance.current) return;
    mapInstance.current.setView([coordinates.latitude, coordinates.longitude], zoom);
  }, []);

  const addCircle = useCallback((coordinates: Coordinates, radius: number, options: L.CircleOptions = {}) => {
    if (!mapInstance.current) return null;
    
    const defaultOptions: L.CircleOptions = {
      color: '#3388ff',
      fillColor: '#3388ff',
      fillOpacity: 0.2,
      weight: 2,
      ...options
    };
    
    return L.circle(
      [coordinates.latitude, coordinates.longitude], 
      radius, 
      defaultOptions
    ).addTo(mapInstance.current);
  }, []);

  return {
    mapContainer,
    initializeMap,
    addVehiclesToMap,
    centerOnCoordinates,
    addCircle
  };
}
