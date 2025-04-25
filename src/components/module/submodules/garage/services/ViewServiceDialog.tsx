
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GarageService } from '../types/garage-types';

interface ViewServiceDialogProps {
  service: GarageService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewServiceDialog: React.FC<ViewServiceDialogProps> = ({
  service,
  open,
  onOpenChange,
}) => {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Nom :</p>
            <p>{service.name}</p>
          </div>
          <div>
            <p className="font-semibold">Description :</p>
            <p>{service.description}</p>
          </div>
          <div>
            <p className="font-semibold">Coût :</p>
            <p>{service.cost}€</p>
          </div>
          <div>
            <p className="font-semibold">Durée :</p>
            <p>{service.duration} minutes</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewServiceDialog;
