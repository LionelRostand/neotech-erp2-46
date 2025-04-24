
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
}

export const ViewServiceDialog = ({ open, onOpenChange, service }: ViewServiceDialogProps) => {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du service</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <p className="font-semibold">Nom</p>
            <p>{service.name}</p>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p>{service.description}</p>
          </div>
          <div>
            <p className="font-semibold">Coût</p>
            <p>{service.cost} €</p>
          </div>
          <div>
            <p className="font-semibold">Durée</p>
            <p>{service.duration} min</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
