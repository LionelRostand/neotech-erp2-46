
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TransportVehicleWithLocation } from '../types';

interface VehicleMapProps {
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

const VehicleMap: React.FC<VehicleMapProps> = ({ vehicles, selectedVehicle, mapContainerRef }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    // Initialize map if it doesn't exist and mapContainerRef is valid
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainerRef]);

  // Update markers when vehicles change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear all existing markers first
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Add markers for all vehicles
    vehicles.forEach(vehicle => {
      const { latitude, longitude } = vehicle.location.coordinates;
      
      // Create a custom icon based on vehicle status
      const iconUrl = getVehicleIcon(vehicle.status, vehicle.location.status);
      
      const vehicleIcon = L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([latitude, longitude], { icon: vehicleIcon })
        .addTo(mapRef.current!);
        
      // Add popup with vehicle info
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${vehicle.name}</h3>
          <p>Plaque: ${vehicle.licensePlate}</p>
          <p>Statut: ${getVehicleStatusText(vehicle.location.status)}</p>
          <p>Vitesse: ${vehicle.location.speed} km/h</p>
        </div>
      `);
      
      // Handle click event
      marker.on('click', () => {
        // Center map on vehicle when clicked
        mapRef.current?.setView([latitude, longitude], 14);
      });
      
      markersRef.current[vehicle.id] = marker;
    });

    // If there's a selected vehicle, center on it
    if (selectedVehicle) {
      const { latitude, longitude } = selectedVehicle.location.coordinates;
      mapRef.current.setView([latitude, longitude], 14);
      
      // Open popup for selected vehicle
      const marker = markersRef.current[selectedVehicle.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [vehicles, selectedVehicle]);

  // Helper functions for vehicle icons and text
  const getVehicleIcon = (vehicleStatus: string, locationStatus: string): string => {
    // In a real app, return different icons based on status
    if (vehicleStatus === 'maintenance') {
      return 'https://cdn-icons-png.flaticon.com/512/4426/4426072.png';
    }
    
    if (locationStatus === 'moving') {
      return 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png';
    }

    return 'https://cdn-icons-png.flaticon.com/512/3097/3097156.png'; // Default icon
  };
  
  const getVehicleStatusText = (status: string): string => {
    switch (status) {
      case 'moving':
        return 'En mouvement';
      case 'idle': 
        return 'À l\'arrêt';
      case 'stopped':
        return 'Immobilisé';
      default:
        return status;
    }
  };
  
  return (
    <div className="border rounded-md overflow-hidden h-[400px]">
      <div ref={mapContainerRef} className="h-full" />
    </div>
  );
};

export default VehicleMap;
