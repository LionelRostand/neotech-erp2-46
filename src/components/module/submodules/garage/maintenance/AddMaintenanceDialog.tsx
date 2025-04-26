
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MaintenanceForm from './MaintenanceForm';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface AddMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMaintenanceDialog = ({ open, onOpenChange }: AddMaintenanceDialogProps) => {
  const { services, mechanics, clients, vehicles } = useGarageData();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      // Ajout du document dans la collection garage_maintenances
      await addDoc(collection(db, 'garage_maintenances'), {
        ...data,
        date: data.date.toISOString(),
        endDate: data.endDate.toISOString(),
      });

      toast.success('Maintenance ajoutée avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la maintenance:', error);
      toast.error('Erreur lors de l\'ajout de la maintenance');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une maintenance</DialogTitle>
        </DialogHeader>
        <MaintenanceForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          mechanics={mechanics}
          clients={clients}
          vehicles={vehicles}
          services={services}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMaintenanceDialog;
