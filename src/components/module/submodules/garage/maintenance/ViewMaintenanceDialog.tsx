
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GarageMaintenance } from '@/hooks/garage/useGarageData';
import { formatDate } from '@/lib/utils';

interface ViewMaintenanceDialogProps {
  maintenance: GarageMaintenance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewMaintenanceDialog = ({ maintenance, open, onOpenChange }: ViewMaintenanceDialogProps) => {
  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la maintenance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Date</p>
              <p>{formatDate(maintenance.date)}</p>
            </div>
            <div>
              <p className="font-medium">Statut</p>
              <p>{maintenance.status}</p>
            </div>
            <div>
              <p className="font-medium">Coût total</p>
              <p>{maintenance.totalCost}€</p>
            </div>
            <div>
              <p className="font-medium">Notes</p>
              <p>{maintenance.notes || 'Aucune note'}</p>
            </div>
          </div>
          <div>
            <p className="font-medium">Services</p>
            <ul className="list-disc pl-5 mt-2">
              {maintenance.services.map((service, index) => (
                <li key={index}>
                  {service.serviceId} - Quantité: {service.quantity} - Coût: {service.cost}€
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMaintenanceDialog;
