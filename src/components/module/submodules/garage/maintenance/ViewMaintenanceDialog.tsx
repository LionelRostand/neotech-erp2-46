
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { useGarageData } from '@/hooks/garage/useGarageData';

interface ViewMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: any;
}

const ViewMaintenanceDialog = ({ 
  open, 
  onOpenChange,
  maintenance
}: ViewMaintenanceDialogProps) => {
  const { vehicles = [], services: garageServices = [] } = useGarageData();

  // If maintenance is undefined or null, don't render the content
  if (!maintenance) return null;

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find((v: any) => v.id === vehicleId);
    if (!vehicle) return "Véhicule inconnu";
    return `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`;
  };

  const getServiceName = (serviceId: string) => {
    const service = garageServices.find((s: any) => s.id === serviceId);
    return service ? service.name : "Service inconnu";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date non spécifiée';
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date invalide';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Détails de la maintenance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Véhicule</h3>
              <p className="mt-1">{maintenance.vehicleId ? getVehicleInfo(maintenance.vehicleId) : 'Non spécifié'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1">{maintenance.date ? formatDate(maintenance.date) : 'Non spécifiée'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{maintenance.description || 'Aucune description'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Statut</h3>
            <p className="mt-1">{getStatusText(maintenance.status)}</p>
          </div>

          {Array.isArray(maintenance.services) && maintenance.services.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Services</h3>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Service</th>
                        <th className="py-2 px-4 text-left">Quantité</th>
                        <th className="py-2 px-4 text-left">Coût</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenance.services.map((service: any, index: number) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 px-4">{getServiceName(service.serviceId)}</td>
                          <td className="py-2 px-4">{service.quantity}</td>
                          <td className="py-2 px-4">{formatCurrency(service.cost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {maintenance.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes additionnelles</h3>
              <p className="mt-1">{maintenance.notes}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500">Coût total</h3>
            <p className="mt-1 text-lg font-semibold">
              {maintenance.totalCost !== undefined ? formatCurrency(maintenance.totalCost) : 'N/A'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMaintenanceDialog;
