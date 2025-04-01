
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, MoreHorizontal } from "lucide-react";
import { TransportVehicleWithLocation } from '../types/transport-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AlertDetailsDialogProps {
  vehicle: TransportVehicleWithLocation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigure: () => void;
}

const AlertDetailsDialog: React.FC<AlertDetailsDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
  onConfigure
}) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), 'PP', { locale: fr });
  };

  // Mock alerts for the vehicle
  const alerts = [
    {
      id: 'alert1',
      type: 'speed',
      message: 'Excès de vitesse détecté',
      timestamp: new Date().toISOString(),
      details: 'Vitesse détectée: 85 km/h dans une zone de 50 km/h'
    },
    {
      id: 'alert2',
      type: 'zone',
      message: 'Entrée dans une zone non autorisée',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      details: 'Véhicule entré dans la zone: Zone industrielle Nord'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Alertes - {vehicle.name}</DialogTitle>
          <DialogDescription>
            Alertes récentes pour ce véhicule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h4 className="font-medium">{alert.message}</h4>
                <Badge 
                  variant="secondary" 
                  className="ml-auto"
                >
                  {formatTime(alert.timestamp)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{alert.details}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  Latitude: {vehicle.location.coordinates.latitude}, Longitude: {vehicle.location.coordinates.longitude}
                </span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={onConfigure}
          >
            Configurer les alertes
          </Button>
          
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailsDialog;
