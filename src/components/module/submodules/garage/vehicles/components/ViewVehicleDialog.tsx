
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';

interface ViewVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewVehicleDialog: React.FC<ViewVehicleDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
}) => {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails du véhicule</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Marque/Modèle</p>
            <p className="text-base">{vehicle.make} {vehicle.model}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Immatriculation</p>
            <p className="text-base">{vehicle.licensePlate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Propriétaire</p>
            <p className="text-base">{vehicle.clientId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kilométrage</p>
            <p className="text-base">{vehicle.mileage} km</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Statut</p>
            <p className="text-base">{vehicle.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Dernier contrôle</p>
            <p className="text-base">{vehicle.lastCheckDate || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleDialog;
