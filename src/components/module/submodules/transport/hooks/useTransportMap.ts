
import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TransportVehicleWithLocation } from '../types/transport-types';
import { getMarkerIconForVehicle, getVehiclePopupContent } from '../utils/map-utils';

// Mock MapBox token - should be replaced with an environment variable in production
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNrczczeXIybzFwZ2QycnNvemU5a3lrZ3UifQ.GwVUDxlh-WJtGWuUU-wZIQ';

mapboxgl.accessToken = MAPBOX_TOKEN;

export const useTransportMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const clearMarkers = useCallback(() => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapContainer.current) return null;
    
    // Don't initialize the map if it already exists
    if (map.current) return map.current;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    return map.current;
  }, []);

  const addVehiclesToMap = useCallback((vehicles: TransportVehicleWithLocation[], onVehicleClick: (vehicle: TransportVehicleWithLocation) => void) => {
    if (!map.current) return;
    
    clearMarkers();
    
    vehicles.forEach(vehicle => {
      const { latitude, longitude } = vehicle.location.coordinates;
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(getVehiclePopupContent(vehicle));
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.backgroundImage = `url('${getMarkerIconForVehicle(vehicle)}')`;
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundSize = '100%';
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current);
      
      // Add click event to marker element
      el.addEventListener('click', () => {
        onVehicleClick(vehicle);
      });
      
      markers.current.push(marker);
    });

    // Add vehicle movement paths (simplified)
    if (vehicles.length > 0 && map.current.getSource('route') === undefined) {
      map.current.on('load', () => {
        if (!map.current) return;
        
        // Mock route data
        const routeData = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [2.3522, 48.8566],  // Paris center
              [2.3442, 48.8496],  // Somewhere nearby
              [2.3376, 48.8606]   // Another nearby location
            ]
          }
        };

        // Add source for vehicle route
        map.current.addSource('route', {
          type: 'geojson',
          data: routeData as any
        });

        // Add route line layer
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0080ff',
            'line-width': 3,
            'line-opacity': 0.7
          }
        });
        
        // Add the vehicle radius (geofence)
        map.current.addSource('vehicleRadius', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [2.3522, 48.8566] // Paris center
            }
          }
        });
        
        map.current.addLayer({
          id: 'vehicleRadius',
          type: 'circle',
          source: 'vehicleRadius',
          paint: {
            'circle-radius': 100,
            'circle-color': '#0080ff',
            'circle-opacity': 0.2,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#0080ff'
          }
        });
      });
    }
  }, [clearMarkers]);

  return {
    mapContainer,
    initializeMap,
    addVehiclesToMap
  };
};
