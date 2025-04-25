
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFirestore } from '@/hooks/useFirestore';

interface DeleteAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  getClientName: (clientId: string) => string;
  getVehicleInfo: (vehicleId: string) => string;
  onSuccess: () => void;
}

const DeleteAppointmentDialog = ({ 
  isOpen, 
  onClose,
  appointment,
  getClientName,
  getVehicleInfo,
  onSuccess
}: DeleteAppointmentDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { remove } = useFirestore('garage_appointments');

  if (!appointment) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Suppression du rendez-vous
      console.log("Deleting appointment with ID:", appointment.id);
      await remove(appointment.id);
      
      // Afficher un message de succès
      toast.success("Rendez-vous supprimé avec succès");
      
      // Appeler la fonction de succès et fermer la boîte de dialogue
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Erreur lors de la suppression du rendez-vous");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer le rendez-vous</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p><strong>Client:</strong> {getClientName(appointment.clientId)}</p>
          <p><strong>Véhicule:</strong> {getVehicleInfo(appointment.vehicleId)}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Heure:</strong> {appointment.time}</p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAppointmentDialog;
