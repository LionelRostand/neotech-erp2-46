
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, MapPin, Gauge, Clock, User } from "lucide-react";
import { TransportVehicleWithLocation } from '../types/map-types';

interface VehicleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: TransportVehicleWithLocation | null;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  open,
  onOpenChange,
  vehicle
}) => {
  if (!vehicle) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "en service":
        return <Badge variant="success">En service</Badge>;
      case "arrêté":
        return <Badge variant="warning">Arrêté</Badge>;
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR');
  };

  // Get status safely from either location status or vehicle status
  const getVehicleStatus = () => {
    if (vehicle.location?.status) {
      return vehicle.location.status;
    }
    
    // Map vehicle status to French if location status is not available
    switch(vehicle.status) {
      case "active":
        return "en service";
      case "maintenance":
        return "maintenance";
      case "out-of-service":
        return "hors service";
      default:
        return String(vehicle.status);
    }
  };

  // Helper function to get coordinates string
  const getCoordinatesString = () => {
    if (!vehicle.location) return "Non disponible";
    
    // Try to get coordinates from various patterns
    const lat = vehicle.location.coordinates?.latitude || 
                vehicle.location.lat || 
                vehicle.location.latitude;
                
    const lng = vehicle.location.coordinates?.longitude || 
                vehicle.location.lng || 
                vehicle.location.longitude;
                
    if (lat && lng) {
      return `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
    }
    
    return "Non disponible";
  };
  
  // Helper function to get last update timestamp
  const getLastUpdate = () => {
    if (!vehicle.location) return "Non disponible";
    
    const timestamp = vehicle.location.timestamp || vehicle.location.lastUpdate;
    return timestamp ? formatDate(timestamp) : "Non disponible";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            <span>Détails du véhicule</span>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées du véhicule {vehicle.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="font-medium text-lg">{vehicle.name}</div>
            <div>{renderStatusBadge(getVehicleStatus())}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Immatriculation</div>
              <div className="font-medium">{vehicle.licensePlate}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-medium">{vehicle.type}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Capacité</div>
              <div className="font-medium">{vehicle.capacity} places</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Carburant</div>
              <div className="font-medium">{vehicle.fuelType}</div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Données de localisation</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Dernière mise à jour</div>
                </div>
                <div className="font-medium">{getLastUpdate()}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Vitesse actuelle</div>
                </div>
                <div className="font-medium">{vehicle.location?.speed || 0} km/h</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Coordonnées</div>
                </div>
                <div className="font-medium">{getCoordinatesString()}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Chauffeur assigné</span>
            </h4>
            <div className="text-muted-foreground">
              {vehicle.driverName || "Aucun chauffeur assigné"}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
