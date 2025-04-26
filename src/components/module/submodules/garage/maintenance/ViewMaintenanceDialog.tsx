
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
  onClose: () => void;
  maintenance: any;
  vehicleInfo?: string;
  clientInfo?: string;
  mechanicInfo?: string;
}

const ViewMaintenanceDialog = ({ 
  open, 
  onClose, 
  maintenance,
  vehicleInfo,
  clientInfo,
  mechanicInfo
}: ViewMaintenanceDialogProps) => {
  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la maintenance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Date</p>
              <p>{format(new Date(maintenance.date), 'dd/MM/yyyy', { locale: fr })}</p>
            </div>
            <div>
              <p className="font-semibold">Coût Total</p>
              <p>{maintenance.totalCost}€</p>
            </div>
            <div>
              <p className="font-semibold">Véhicule</p>
              <p>{vehicleInfo}</p>
            </div>
            <div>
              <p className="font-semibold">Client</p>
              <p>{clientInfo}</p>
            </div>
            <div>
              <p className="font-semibold">Mécanicien</p>
              <p>{mechanicInfo}</p>
            </div>
            <div>
              <p className="font-semibold">Statut</p>
              <p>{maintenance.status}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p>{maintenance.description}</p>
          </div>
          {maintenance.services && maintenance.services.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Services</p>
              {maintenance.services.map((service: any, index: number) => (
                <div key={index} className="pl-4 mb-2">
                  <p>Service: {service.serviceId}</p>
                  <p>Quantité: {service.quantity}</p>
                  <p>Coût: {service.cost}€</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMaintenanceDialog;
