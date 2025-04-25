
import React from 'react';
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

interface DeleteAppointmentDialogProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  getClientName: (clientId: string) => string;
  getVehicleInfo: (vehicleId: string) => string;
}

const DeleteAppointmentDialog = ({ 
  appointment, 
  isOpen, 
  onClose,
  getClientName,
  getVehicleInfo
}: DeleteAppointmentDialogProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Here you would delete the appointment from the database
      console.log("Deleting appointment with ID:", appointment.id);
      
      // Show success message
      toast.success("Rendez-vous supprimé avec succès");
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Erreur lors de la suppression du rendez-vous");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!appointment) return null;

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
