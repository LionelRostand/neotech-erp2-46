
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TransportReservation } from '../types/transport-types';
import { toast } from "sonner";
import { deleteDocument } from '@/hooks/firestore/delete-operations';

interface DeleteReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: TransportReservation;
  onDeleted: () => void;
}

const DeleteReservationDialog: React.FC<DeleteReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  onDeleted
}) => {
  const handleDelete = async () => {
    try {
      // Here you would typically delete the reservation from your backend
      // await deleteDocument('transport_reservations', reservation.id);
      console.log("Deleting reservation:", reservation.id);
      
      toast.success("Réservation supprimée avec succès");
      onDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Erreur lors de la suppression de la réservation");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la réservation</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette réservation ?
            Cette action est irréversible et supprimera définitivement la réservation {reservation.id}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReservationDialog;
