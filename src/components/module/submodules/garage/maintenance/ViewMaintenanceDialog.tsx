
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const { clients } = useGarageData();
  const navigate = useNavigate();

  // Helper function to get client name
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client non assigné';
  };

  // Function to handle invoice creation
  const handleCreateInvoice = () => {
    // Générer un numéro de facture unique basé sur la date
    const invoiceNumber = `FAC-${Date.now()}`;
    
    // Créer les données de la facture
    const invoiceData = {
      invoiceNumber,
      clientId: maintenance.clientId,
      clientName: getClientName(maintenance.clientId),
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Échéance à 30 jours
      amount: maintenance.totalCost,
      maintenanceId: maintenance.id,
      status: 'pending'
    };

    // Stocker les données dans sessionStorage pour la page des factures
    sessionStorage.setItem('newInvoiceData', JSON.stringify(invoiceData));
    
    // Rediriger vers la page des factures
    navigate('/modules/garage/invoices');
    
    toast.success("Redirection vers la création de facture");
    onOpenChange(false);
  };

  if (!maintenance) return null;

  // Helper function to get vehicle info
  const getVehicleInfo = (vehicleId: string) => {
    // Assuming vehicles is an array of objects with id, make, model, and licensePlate properties
    const vehicle = useGarageData().vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name || ''} (${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate})` : 'Véhicule non assigné';
  };

  // Helper function to get mechanic name
  const getMechanicName = (mechanicId: string) => {
    // Assuming mechanics is an array of objects with id, firstName, and lastName properties
    const mechanic = useGarageData().mechanics.find(m => m.id === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'Mécanicien non assigné';
  };

  // Helper function to get service name
  const getServiceName = (serviceId: string) => {
    // Assuming services is an array of objects with id and name properties
    const service = useGarageData().services.find(s => s.id === serviceId);
    return service ? service.name : 'Service non défini';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date non définie';
    }
  };

  // Helper function to get status display
  const getStatusDisplay = (status: string) => {
    const statusConfig = {
      completed: 'Terminé',
      in_progress: 'En cours',
      scheduled: 'Planifié',
      cancelled: 'Annulé'
    };
    return statusConfig[status as keyof typeof statusConfig] || status;
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
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleCreateInvoice}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Créer une facture
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMaintenanceDialog;
