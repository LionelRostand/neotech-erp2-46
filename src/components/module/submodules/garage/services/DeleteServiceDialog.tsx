
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { GarageService } from '../types/garage-types';

interface DeleteServiceDialogProps {
  service: GarageService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceDeleted: () => void;
}

const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  service,
  open,
  onOpenChange,
  onServiceDeleted,
}) => {
  const { remove } = useFirestore('garage_services');

  const handleDelete = async () => {
    if (!service?.id) return;
    try {
      await remove(service.id);
      toast.success('Service supprimé avec succès');
      onServiceDeleted();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la suppression du service');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement le service
            {service?.name ? ` "${service.name}"` : ''}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServiceDialog;
