
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditAppointmentDialogProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
  vehicles: any[];
  mechanics: any[];
  services: any[];
}

const EditAppointmentDialog = ({ 
  appointment, 
  isOpen, 
  onClose,
  clients,
  vehicles,
  mechanics,
  services
}: EditAppointmentDialogProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      clientId: appointment?.clientId || '',
      vehicleId: appointment?.vehicleId || '',
      date: appointment?.date || '',
      time: appointment?.time || '',
      mechanicId: appointment?.mechanicId || '',
      serviceId: appointment?.serviceId || '',
      status: appointment?.status || 'scheduled',
      notes: appointment?.notes || '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // Here you would update the appointment in the database
      console.log("Updating appointment with data:", data);
      
      // Show success message
      toast.success("Rendez-vous mis à jour avec succès");
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Erreur lors de la mise à jour du rendez-vous");
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields would go here */}
          <p className="text-center text-gray-500">Formulaire d'édition de rendez-vous</p>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;
