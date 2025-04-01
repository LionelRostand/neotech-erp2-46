
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransportVehicleWithLocation } from '../types/transport-types';
import { normalizeCoordinates, formatTimestamp } from '../utils/map-utils';

interface VehicleDetailsDialogProps {
  vehicle: TransportVehicleWithLocation;
  isOpen: boolean;
  onClose: () => void;
  onShowAlerts: () => void;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  vehicle,
  isOpen,
  onClose,
  onShowAlerts
}) => {
  // Normalize coordinates for consistent access
  const coordinates = normalizeCoordinates(vehicle.location);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'moving':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-blue-100 text-blue-800';
      case 'stopped':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'out-of-service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormattedSpeed = (speed: number) => {
    return `${speed} km/h`;
  };

  const getHeadingDirection = (heading: number) => {
    const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
    const index = Math.round(((heading % 360) / 45)) % 8;
    return directions[index];
  };
  
  // Helper to get last update time - using timestamp directly since lastUpdate doesn't exist in the type
  const getLastUpdateTime = () => {
    if (vehicle.location.timestamp) {
      return formatTimestamp(vehicle.location.timestamp);
    }
    return "Non disponible";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{vehicle.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getVehicleStatusClass(vehicle.status)}`}>
              {vehicle.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Immatriculation</p>
                <p>{vehicle.licensePlate}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Type de véhicule</p>
                <p>{vehicle.type}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Capacité</p>
                <p>{vehicle.capacity} passagers</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Disponibilité</p>
                <p>{vehicle.available ? 'Disponible' : 'Non disponible'}</p>
              </div>

              {vehicle.driverName && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Chauffeur</p>
                  <p>{vehicle.driverName}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Statut actuel</p>
                <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusClass(vehicle.location.status)}`}>
                  {vehicle.location.status}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Dernière mise à jour</p>
                <p>{getLastUpdateTime()}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p className="font-mono text-xs">
                  {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Vitesse</p>
                <p>{getFormattedSpeed(vehicle.location.speed)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Direction</p>
                <p>{getHeadingDirection(vehicle.location.heading)}</p>
              </div>
            </div>
          </div>

          {/* Map thumbnail could go here */}
          <div className="mt-4 h-40 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Carte miniature</p>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onShowAlerts}>
              Alertes
            </Button>
            <Button>
              Itinéraire
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
