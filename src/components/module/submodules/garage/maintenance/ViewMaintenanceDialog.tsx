
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Maintenance } from './types';

interface ViewMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: Maintenance | null;
}

const ViewMaintenanceDialog = ({ open, onOpenChange, maintenance }: ViewMaintenanceDialogProps) => {
  const { clients, vehicles, mechanics, services } = useGarageData();

  if (!maintenance) return null;

  // Helper functions to get names instead of IDs
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : clientId;
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}` : vehicleId;
  };

  const getMechanicName = (mechanicId: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : mechanicId;
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  // Format status for display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifiée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la maintenance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Date</h3>
            <p>{formatDate(maintenance.date)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Client</h3>
            <p>{getClientName(maintenance.clientId)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Véhicule</h3>
            <p>{getVehicleInfo(maintenance.vehicleId)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Mécanicien</h3>
            <p>{getMechanicName(maintenance.mechanicId)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Statut</h3>
            <p>{getStatusDisplay(maintenance.status)}</p>
          </div>

          {maintenance.services && maintenance.services.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Services</h3>
              <ul className="space-y-2">
                {maintenance.services.map((service, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{getServiceName(service.serviceId)} x{service.quantity}</span>
                    <span>{service.quantity * service.cost} €</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
