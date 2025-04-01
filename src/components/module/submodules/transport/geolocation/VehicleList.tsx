
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, MapPin, Clock, Info } from 'lucide-react';
import { TransportVehicleWithLocation } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VehicleListProps {
  vehicles: TransportVehicleWithLocation[];
  selectedVehicleId?: string;
  onSelectVehicle: (vehicle: TransportVehicleWithLocation) => void;
  onOpenAlertDialog: () => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  selectedVehicleId,
  onSelectVehicle,
  onOpenAlertDialog
}) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'moving':
        return <Badge className="bg-green-500">En mouvement</Badge>;
      case 'idle':
        return <Badge className="bg-yellow-500">À l'arrêt</Badge>;
      case 'stopped':
        return <Badge className="bg-red-500">Immobilisé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Véhicules ({vehicles.length})</h3>
      
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-4 text-center text-muted-foreground">
            Aucun véhicule ne correspond à votre recherche.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vehicles.map(vehicle => (
            <Card 
              key={vehicle.id} 
              className={`cursor-pointer transition hover:bg-accent/50 ${vehicle.id === selectedVehicleId ? 'border-primary' : ''}`}
              onClick={() => onSelectVehicle(vehicle)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{vehicle.name}</h4>
                      {getStatusBadge(vehicle.location.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {vehicle.licensePlate} • {vehicle.type}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{vehicle.location.coordinates.latitude.toFixed(4)}, {vehicle.location.coordinates.longitude.toFixed(4)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(vehicle.location.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVehicle(vehicle);
                      onOpenAlertDialog();
                    }}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
