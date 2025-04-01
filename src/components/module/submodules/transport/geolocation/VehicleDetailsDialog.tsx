
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, AlertCircle, Truck, Settings, User, Navigation, AlertTriangle, RotateCw } from "lucide-react";
import { TransportVehicleWithLocation } from '../types/transport-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [activeTab, setActiveTab] = useState('location');

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), 'PP', { locale: fr });
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

  // Read coordinates from the vehicle location object
  const { coordinates } = vehicle.location;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{vehicle.name} ({vehicle.licensePlate})</span>
            {getStatusBadge(vehicle.location.status)}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Localisation</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Truck size={16} />
              <span>Infos véhicule</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>Alertes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm text-muted-foreground">Dernière mise à jour:</span>
                <span>
                  {formatTime(vehicle.location.timestamp)} - {formatDate(vehicle.location.timestamp)}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('location')}
              >
                <RotateCw size={16} />
              </Button>
            </div>

            <div className="bg-slate-100 p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <MapPin size={16} />
                <span>Coordonnées</span>
              </h4>
              <p className="text-sm">
                Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Navigation size={16} />
                <span className="text-sm">Direction: {vehicle.location.heading}°</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Settings size={16} />
                <span className="text-sm">Vitesse: {vehicle.location.speed} km/h</span>
              </div>
            </div>

            {/* Fake map placeholder */}
            <div className="border rounded-md overflow-hidden" style={{ height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted-foreground">Carte de localisation</p>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Type de véhicule</h4>
                <p>{vehicle.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Capacité</h4>
                <p>{vehicle.capacity} personnes</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Statut</h4>
                <Badge className={vehicle.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                  {vehicle.status === 'active' ? 'Actif' : 'Maintenance'}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Disponible</h4>
                <Badge variant={vehicle.available ? 'success' : 'destructive'}>
                  {vehicle.available ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Conducteur assigné</h4>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{vehicle.driverName || 'Non assigné'}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Alertes récentes</h4>
              <Button variant="outline" size="sm" onClick={onShowAlerts}>
                Voir toutes les alertes
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Sample alerts */}
              <div className="flex items-start gap-2 p-3 border rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Excès de vitesse</p>
                  <p className="text-sm text-muted-foreground">Vitesse: 85 km/h dans une zone de 50 km/h</p>
                  <p className="text-xs text-muted-foreground mt-1">Aujourd'hui, 14:30</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 border rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Entrée en zone non autorisée</p>
                  <p className="text-sm text-muted-foreground">Zone industrielle Nord</p>
                  <p className="text-xs text-muted-foreground mt-1">Aujourd'hui, 13:15</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
