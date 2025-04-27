
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifié';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, { dateString });
      return dateString || 'Date invalide';
    }
  };

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
              <p>{formatDate(maintenance.date)}</p>
            </div>
            <div>
              <p className="font-semibold">Coût Total</p>
              <p>{maintenance.totalCost !== undefined ? `${maintenance.totalCost}€` : 'Non spécifié'}</p>
            </div>
            <div>
              <p className="font-semibold">Véhicule</p>
              <p>{vehicleInfo || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="font-semibold">Client</p>
              <p>{clientInfo || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="font-semibold">Mécanicien</p>
              <p>{mechanicInfo || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="font-semibold">Statut</p>
              <p>{maintenance.status || 'Non spécifié'}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p>{maintenance.description || 'Aucune description'}</p>
          </div>
          {maintenance.services && maintenance.services.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Services</p>
              {maintenance.services.map((service: any, index: number) => (
                <div key={index} className="pl-4 mb-2">
                  <p>Service: {service.serviceId || 'Non spécifié'}</p>
                  <p>Quantité: {service.quantity !== undefined ? service.quantity : 'Non spécifié'}</p>
                  <p>Coût: {service.cost !== undefined ? `${service.cost}€` : 'Non spécifié'}</p>
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
