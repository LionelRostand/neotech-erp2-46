
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: any | null;
}

const ViewMaintenanceDialog = ({ open, onOpenChange, maintenance }: ViewMaintenanceDialogProps) => {
  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la maintenance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Date</h3>
            <p>{format(new Date(maintenance.date), 'PPP', { locale: fr })}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Client</h3>
            <p>{maintenance.clientId}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Véhicule</h3>
            <p>{maintenance.vehicleId}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Mécanicien</h3>
            <p>{maintenance.mechanicId}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Status</h3>
            <p>{maintenance.status}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Coût total</h3>
            <p>{maintenance.totalCost} €</p>
          </div>
          {maintenance.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p>{maintenance.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMaintenanceDialog;
