
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { Badge } from "@/components/ui/badge";

interface ViewVehicleDialogProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewVehicleDialog: React.FC<ViewVehicleDialogProps> = ({
  vehicle,
  isOpen,
  onClose
}) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Marque</p>
              <p className="text-sm text-gray-500">{vehicle.make}</p>
            </div>
            <div>
              <p className="font-medium">Modèle</p>
              <p className="text-sm text-gray-500">{vehicle.model}</p>
            </div>
            <div>
              <p className="font-medium">Année</p>
              <p className="text-sm text-gray-500">{vehicle.year}</p>
            </div>
            <div>
              <p className="font-medium">Immatriculation</p>
              <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
            </div>
            <div>
              <p className="font-medium">Kilométrage</p>
              <p className="text-sm text-gray-500">{vehicle.mileage} km</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <Badge variant="outline" className="mt-1">
                {vehicle.status === 'available' ? 'Disponible' : 'En maintenance'}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleDialog;
