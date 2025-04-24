
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Vehicle } from '../types/garage-types';

interface ViewVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle;
}

const ViewVehicleDialog = ({ open, onOpenChange, vehicle }: ViewVehicleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Marque:</dt>
            <dd className="col-span-3">{vehicle.make}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Modèle:</dt>
            <dd className="col-span-3">{vehicle.model}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Année:</dt>
            <dd className="col-span-3">{vehicle.year}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Immatriculation:</dt>
            <dd className="col-span-3">{vehicle.licensePlate}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Kilométrage:</dt>
            <dd className="col-span-3">{vehicle.mileage?.toLocaleString()} km</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Dernier contrôle:</dt>
            <dd className="col-span-3">
              {vehicle.lastCheckDate ? format(new Date(vehicle.lastCheckDate), 'PPP', { locale: fr }) : 'Non renseigné'}
            </dd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleDialog;
