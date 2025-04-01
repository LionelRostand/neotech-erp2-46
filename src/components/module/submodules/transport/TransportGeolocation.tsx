
import React, { useState, useEffect } from 'react';
import { useTransportMap } from './hooks/useTransportMap';
import { TransportVehicleWithLocation } from './types/transport-types';
import AlertConfigDialog from './geolocation/AlertConfigDialog';
import AlertDetailsDialog from './geolocation/AlertDetailsDialog';
import VehicleDetailsDialog from './geolocation/VehicleDetailsDialog';
import { toast } from "@/components/ui/use-toast";

const TransportGeolocation = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicleWithLocation | null>(null);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isAlertConfigOpen, setIsAlertConfigOpen] = useState(false);

  // Mock vehicle locations for demonstration
  const mockVehicleLocations: TransportVehicleWithLocation[] = [
    {
      id: 'v1',
      name: 'Mercedes Sprinter',
      type: 'van',
      licensePlate: 'AA-123-BB',
      capacity: 8,
      available: true,
      status: 'active',
      location: {
        vehicleId: 'v1',
        coordinates: {
          latitude: 48.8566,
          longitude: 2.3522
        },
        timestamp: new Date().toISOString(),
        status: 'moving',
        heading: 90,
        speed: 50
      }
    },
    {
      id: 'v2',
      name: 'Tesla Model S',
      type: 'sedan',
      licensePlate: 'CC-456-DD',
      capacity: 4,
      available: true,
      status: 'active',
      location: {
        vehicleId: 'v2',
        coordinates: {
          latitude: 48.8496,
          longitude: 2.3442
        },
        timestamp: new Date().toISOString(),
        status: 'idle',
        heading: 180,
        speed: 0
      }
    },
    {
      id: 'v3',
      name: 'BMW X5',
      type: 'suv',
      licensePlate: 'EE-789-FF',
      capacity: 5,
      available: false,
      status: 'maintenance',
      location: {
        vehicleId: 'v3',
        coordinates: {
          latitude: 48.8606,
          longitude: 2.3376
        },
        timestamp: new Date().toISOString(),
        status: 'stopped',
        heading: 270,
        speed: 0
      }
    },
    {
      id: 'v4',
      name: 'Renault Trafic',
      type: 'van',
      licensePlate: 'GG-012-HH',
      capacity: 9,
      available: true,
      status: 'active',
      location: {
        vehicleId: 'v4',
        coordinates: {
          latitude: 48.8446,
          longitude: 2.3252
        },
        timestamp: new Date().toISOString(),
        status: 'idle',
        heading: 0,
        speed: 0
      }
    }
  ];

  const { mapContainer, initializeMap, addVehiclesToMap } = useTransportMap();

  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainer.current && !isMapLoaded) {
      const mapInstance = initializeMap();
      if (mapInstance) {
        addVehiclesToMap(mockVehicleLocations, handleVehicleClick);
        setIsMapLoaded(true);
      }
    }
  }, [mapContainer, isMapLoaded, mockVehicleLocations]);

  // Handler for vehicle marker click
  const handleVehicleClick = (vehicle: TransportVehicleWithLocation) => {
    setSelectedVehicle(vehicle);
    setIsVehicleDialogOpen(true);
  };

  // Handler for showing alert details
  const handleShowAlert = (vehicleId: string) => {
    const vehicle = mockVehicleLocations.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setIsAlertDialogOpen(true);
    }
  };

  // Handler for configuring alerts
  const handleConfigureAlerts = () => {
    setIsAlertConfigOpen(true);
  };

  // Handler for saving alert configuration
  const handleSaveAlertConfig = (config: any) => {
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres d'alerte ont été mis à jour.",
    });
    setIsAlertConfigOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Géolocalisation</h2>
        <button
          onClick={handleConfigureAlerts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Configurer les alertes
        </button>
      </div>

      {/* Main map container */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div ref={mapContainer} style={{ height: '600px' }}></div>
      </div>

      {/* Vehicle details dialog */}
      {selectedVehicle && (
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          isOpen={isVehicleDialogOpen}
          onClose={() => setIsVehicleDialogOpen(false)}
          onShowAlerts={() => {
            setIsVehicleDialogOpen(false);
            setIsAlertDialogOpen(true);
          }}
        />
      )}

      {/* Alert details dialog */}
      {selectedVehicle && (
        <AlertDetailsDialog
          vehicle={selectedVehicle}
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
          onConfigure={handleConfigureAlerts}
        />
      )}

      {/* Alert configuration dialog */}
      <AlertConfigDialog
        open={isAlertConfigOpen}
        onOpenChange={setIsAlertConfigOpen}
        onSave={handleSaveAlertConfig}
      />
    </div>
  );
};

export default TransportGeolocation;
