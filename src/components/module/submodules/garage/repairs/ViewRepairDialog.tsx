
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Repair } from '../../types/garage-types';

interface ViewRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewRepairDialog: React.FC<ViewRepairDialogProps> = ({ 
  repair, 
  open, 
  onOpenChange 
}) => {
  if (!repair) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de la réparation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Description:</p>
            <p className="col-span-3">{repair.description}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Statut:</p>
            <p className="col-span-3">{repair.status}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Date début:</p>
            <p className="col-span-3">{repair.startDate}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Date fin:</p>
            <p className="col-span-3">{repair.endDate || 'Non terminé'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Coût:</p>
            <p className="col-span-3">{repair.cost} €</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRepairDialog;
