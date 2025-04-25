
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vehicle } from '../../../types/garage-types';

interface ViewVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewVehicleDialog = ({ vehicle, open, onOpenChange }: ViewVehicleDialogProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du véhicule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <span className="font-bold">Marque : </span>
            <span>{vehicle.brand || vehicle.make}</span>
          </div>
          <div>
            <span className="font-bold">Modèle : </span>
            <span>{vehicle.model}</span>
          </div>
          <div>
            <span className="font-bold">Immatriculation : </span>
            <span>{vehicle.registrationNumber || vehicle.licensePlate}</span>
          </div>
          <div>
            <span className="font-bold">Propriétaire : </span>
            <span>{vehicle.clientId}</span>
          </div>
          <div>
            <span className="font-bold">Kilométrage : </span>
            <span>{vehicle.mileage} km</span>
          </div>
          <div>
            <span className="font-bold">Statut : </span>
            <span>{vehicle.status}</span>
          </div>
          <div>
            <span className="font-bold">Dernier contrôle : </span>
            <span>{vehicle.lastServiceDate || vehicle.lastCheckDate || '-'}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleDialog;
