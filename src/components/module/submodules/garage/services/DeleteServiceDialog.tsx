
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

interface Service {
  id: string;
  name: string;
}

interface DeleteServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceDeleted: () => void;
}

export function DeleteServiceDialog({ 
  service, 
  open, 
  onOpenChange, 
  onServiceDeleted 
}: DeleteServiceDialogProps) {
  const { remove } = useFirestore('garage_services');

  const handleDelete = async () => {
    try {
      console.log("Deleting service:", service.id);
      await remove(service.id);
      toast.success('Service supprimé avec succès');
      onOpenChange(false);
      onServiceDeleted();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error(`Erreur lors de la suppression du service: ${error.message}`);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le service "{service.name}" ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
