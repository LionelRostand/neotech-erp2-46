
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Car, Clock, MapPin } from "lucide-react";

interface AlertDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: any;
  onResolve: (alertId: string) => void;
}

const AlertDetailsDialog: React.FC<AlertDetailsDialogProps> = ({
  open,
  onOpenChange,
  alert,
  onResolve
}) => {
  if (!alert) return null;

  const renderAlertBadge = (type: string, status: string) => {
    let bgColor = "bg-red-500";
    
    if (status === 'resolved') {
      bgColor = "bg-gray-500";
    }
    
    return <Badge className={bgColor}>{type}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR');
  };

  const handleResolve = () => {
    onResolve(alert.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Détails de l'alerte</span>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'alerte
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2">
              {renderAlertBadge(alert.type, alert.status)}
              <h3 className="font-medium text-lg">{alert.vehicleName}</h3>
            </div>
            <div>
              <Badge variant="outline" className={alert.status === 'resolved' ? 'bg-gray-100' : 'bg-red-100'}>
                {alert.status === 'resolved' ? 'Résolu' : 'Non résolu'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="text-base">{alert.message}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Véhicule</div>
              </div>
              <div className="font-medium">{alert.vehicleName} ({alert.licensePlate})</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Date et heure</div>
              </div>
              <div className="font-medium">{formatDate(alert.timestamp)}</div>
            </div>
          </div>
          
          {alert.type === 'geofence' && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Localisation</span>
              </h4>
              <div className="text-sm">
                Le véhicule est sorti de la zone autorisée à {formatDate(alert.timestamp)}.
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <div className="text-sm">Coordonnées: {alert.location?.lat.toFixed(6)}, {alert.location?.lng.toFixed(6)}</div>
              </div>
            </div>
          )}
          
          {alert.type === 'speeding' && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Détails de l'excès de vitesse</span>
              </h4>
              <div className="text-sm">
                Vitesse détectée: <span className="font-medium">{alert.speed} km/h</span> dans une zone limitée à <span className="font-medium">{alert.speedLimit} km/h</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            {alert.status !== 'resolved' && (
              <Button onClick={handleResolve}>
                Résoudre l'alerte
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailsDialog;
