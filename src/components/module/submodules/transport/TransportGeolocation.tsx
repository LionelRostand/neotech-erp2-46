
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransportMap } from './hooks/useTransportMap';
import { TransportVehicleWithLocation } from './types';
import 'leaflet/dist/leaflet.css';

const VEHICLE_STATUS_MAP = {
  'moving': 'en mouvement',
  'idle': 'en service',
  'stopped': 'arrêté',
  'offline': 'maintenance'
};

// Mock data
const mockVehicleLocations: TransportVehicleWithLocation[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
    capacity: 5, // Added capacity
    location: {
      vehicleId: "veh-001",
      coordinates: { latitude: 48.873792, longitude: 2.295028 },
      timestamp: new Date().toISOString(),
      status: 'moving',
      heading: 45,
      speed: 30
    }
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    licensePlate: "EF-456-GH",
    available: true,
    status: "active",
    capacity: 5, // Added capacity
    location: {
      vehicleId: "veh-002",
      coordinates: { latitude: 48.858370, longitude: 2.294481 },
      timestamp: new Date().toISOString(),
      status: 'idle',
      heading: 90,
      speed: 0
    }
  },
  {
    id: "veh-003",
    name: "Tesla Model S",
    type: "luxury",
    licensePlate: "QR-345-ST",
    available: false,
    status: "maintenance",
    capacity: 5, // Added capacity
    location: {
      vehicleId: "veh-003",
      coordinates: { latitude: 48.843394, longitude: 2.326242 },
      timestamp: new Date().toISOString(),
      status: 'stopped',
      heading: 0,
      speed: 0
    }
  },
  {
    id: "veh-004",
    name: "Mercedes Classe V",
    type: "van",
    licensePlate: "MN-012-OP",
    available: true,
    status: "active",
    capacity: 8, // Added capacity
    location: {
      vehicleId: "veh-004",
      coordinates: { latitude: 48.861934, longitude: 2.339114 },
      timestamp: new Date().toISOString(),
      status: 'idle',
      heading: 270,
      speed: 5
    }
  }
];

const TransportGeolocation = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicleWithLocation | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);

  // Use custom hook for map functionality
  const {
    mapRef,
    isMapLoaded,
    updateMarkers,
    refreshMap,
    mapInitialized
  } = useTransportMap();

  // Load markers when map is initialized
  useEffect(() => {
    if (mapInitialized && updateMarkers) {
      updateMarkers(mockVehicleLocations);
    }
  }, [mapInitialized, updateMarkers]);

  // Update the markers periodically to simulate movement
  useEffect(() => {
    if (!isMapLoaded) return;

    const interval = setInterval(() => {
      if (trackingEnabled) {
        // In a real app, would fetch new locations from server
        // For now, just simulate movement by adjusting coordinates
        const updatedLocations = mockVehicleLocations.map(vehicle => {
          if (vehicle.location) {
            return {
              ...vehicle,
              location: {
                ...vehicle.location,
                coordinates: {
                  latitude: vehicle.location.coordinates.latitude + (Math.random() - 0.5) * 0.001,
                  longitude: vehicle.location.coordinates.longitude + (Math.random() - 0.5) * 0.001
                }
              }
            };
          }
          return vehicle;
        });
        
        if (updateMarkers) {
          updateMarkers(updatedLocations);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMapLoaded, trackingEnabled, updateMarkers]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Géolocalisation des Véhicules</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col h-[600px]">
            <div className="flex justify-between mb-4">
              <Button 
                variant={trackingEnabled ? "default" : "outline"}
                onClick={() => setTrackingEnabled(!trackingEnabled)}
              >
                {trackingEnabled ? "Désactiver le suivi en direct" : "Activer le suivi en direct"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  if (refreshMap) refreshMap();
                  if (updateMarkers) updateMarkers(mockVehicleLocations);
                }}
              >
                Rafraîchir la carte
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {mockVehicleLocations.map(vehicle => (
                <Card 
                  key={vehicle.id} 
                  className={`cursor-pointer hover:border-primary ${selectedVehicle?.id === vehicle.id ? 'border-primary border-2' : ''}`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{vehicle.licensePlate}</p>
                    <div className="flex justify-between text-xs">
                      <span>Statut: {vehicle.location ? VEHICLE_STATUS_MAP[vehicle.location.status] : 'Inconnu'}</span>
                      <span>Vitesse: {vehicle.location?.speed || 0} km/h</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex-1 relative border rounded-md overflow-hidden">
              <div ref={mapRef} className="absolute inset-0" />
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <p>Chargement de la carte...</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportGeolocation;
