
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
import { useFirestore } from '@/hooks/useFirestore';

interface NewAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
  vehicles: any[];
  mechanics: any[];
  services: any[];
  onSuccess: () => void;
}

const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  isOpen,
  onClose,
  clients,
  vehicles,
  mechanics,
  services,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      clientId: '',
      vehicleId: '',
      date: '',
      time: '',
      mechanicId: '',
      serviceId: '',
      notes: '',
      status: 'scheduled'
    }
  });
  
  const { add } = useFirestore('garage_appointments');

  const onSubmit = async (data: any) => {
    try {
      // Ajouter un nouvel enregistrement à la collection
      await add({
        ...data,
        createdAt: new Date().toISOString()
      });
      
      // Afficher un message de succès
      toast.success("Rendez-vous créé avec succès");
      
      // Fermer la boîte de dialogue et rafraîchir les données
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erreur lors de la création du rendez-vous");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Ici, nous ajouterions les champs du formulaire */}
          <div className="text-center text-gray-500">
            Formulaire de création de rendez-vous
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentDialog;
