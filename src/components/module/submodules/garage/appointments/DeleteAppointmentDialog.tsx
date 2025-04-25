
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface DeleteAppointmentDialogProps {
  appointment: any;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAppointmentDialog = ({
  appointment,
  open,
  onClose,
  onDelete
}: DeleteAppointmentDialogProps) => {
  const handleDelete = async () => {
    try {
      const appointmentRef = doc(db, COLLECTIONS.GARAGE.APPOINTMENTS, appointment.id);
      await deleteDoc(appointmentRef);
      onDelete();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le rendez-vous</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAppointmentDialog;
