
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, FileText } from 'lucide-react';
import { GarageMaintenance } from '@/types/module-types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface MaintenanceActionsProps {
  maintenance: GarageMaintenance;
  onView: (maintenance: GarageMaintenance) => void;
  onEdit: (maintenance: GarageMaintenance) => void;
  onDelete: (maintenance: GarageMaintenance) => void;
}

const MaintenanceActions = ({ 
  maintenance, 
  onView, 
  onEdit, 
  onDelete 
}: MaintenanceActionsProps) => {
  const queryClient = useQueryClient();

  const handleGenerateInvoice = async () => {
    try {
      const invoice = {
        clientId: maintenance.clientId,
        clientName: maintenance.clientName,
        vehicleId: maintenance.vehicleId,
        vehicleName: maintenance.vehicleName,
        date: new Date().toISOString(),
        items: maintenance.services.map(service => ({
          description: service.serviceId,
          quantity: service.quantity,
          unitPrice: service.cost,
          total: service.quantity * service.cost
        })),
        status: 'pending',
        totalAmount: maintenance.totalCost,
        maintenanceId: maintenance.id,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'garage_invoices'), invoice);
      
      toast({
        title: "Succès",
        description: "Facture générée avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ['garage', 'invoices'] });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération de la facture",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={() => onView(maintenance)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onEdit(maintenance)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(maintenance)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleGenerateInvoice}
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MaintenanceActions;
