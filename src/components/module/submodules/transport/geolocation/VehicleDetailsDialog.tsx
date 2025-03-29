
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
        return <Badge className="bg-green-500">En service</Badge>;
      case "arrêté":
        return <Badge className="bg-yellow-500">Arrêté</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR');
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
            <div>{renderStatusBadge(vehicle.location?.status || "")}</div>
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
                <div className="font-medium">{formatDate(vehicle.location?.lastUpdate || "")}</div>
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
                <div className="font-medium">
                  {vehicle.location?.lat.toFixed(6)}, {vehicle.location?.lng.toFixed(6)}
                </div>
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
