
import { useEffect, useRef, useState } from 'react';
import { TransportVehicleWithLocation } from '../types';
import { getVehiclePopupContent } from '../utils/map-utils';

interface UseTransportMapOptions {
  center?: [number, number];
  zoom?: number;
}

export const useTransportMap = (vehicles: TransportVehicleWithLocation[], options?: UseTransportMapOptions) => {
  const mapInstance = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicleWithLocation | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Mock initialization for Leaflet map
    const mockMap = {
      setView: (center: [number, number], zoom: number) => {},
      remove: () => {},
      on: (event: string, callback: Function) => {},
      flyTo: (center: [number, number], zoom: number) => {},
    };

    mapInstance.current = mockMap;
    setIsLoaded(true);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Update markers when vehicles change
  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;

    // Clear existing markers
    markersRef.current.clear();

    // Create new markers
    vehicles.forEach(vehicle => {
      const location = vehicle.location;
      const position = [
        'coordinates' in location ? location.coordinates.latitude : location.lat,
        'coordinates' in location ? location.coordinates.longitude : location.lng
      ] as [number, number];

      // Create a marker for each vehicle
      const marker = {
        id: vehicle.id,
        position,
        bindPopup: (content: string) => {},
        setIcon: (icon: any) => {},
        on: (event: string, callback: Function) => {},
      };

      // Bind popup content
      marker.bindPopup(getVehiclePopupContent(vehicle));

      // Add marker to map
      markersRef.current.set(vehicle.id, marker);
    });
  }, [vehicles, isLoaded]);

  // Handle vehicle selection
  const selectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId) || null;
    setSelectedVehicle(vehicle);

    if (vehicle && mapInstance.current) {
      const location = vehicle.location;
      const position = [
        'coordinates' in location ? location.coordinates.latitude : location.lat,
        'coordinates' in location ? location.coordinates.longitude : location.lng
      ] as [number, number];
      
      mapInstance.current.flyTo(position, 15);
    }
  };

  return {
    map: mapInstance.current,
    markers: Array.from(markersRef.current.values()),
    isLoaded,
    selectedVehicle,
    selectVehicle,
  };
};
