
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Reservation } from '../types/rental-types';
import { toast } from "sonner";

interface DeleteReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
}

const DeleteReservationDialog: React.FC<DeleteReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
}) => {
  const handleDelete = () => {
    // Here you would typically delete the reservation from your backend
    console.log("Deleting reservation:", reservation.id);
    
    toast.success("Réservation supprimée avec succès");
    onOpenChange(false);
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
