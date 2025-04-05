
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AbsenceForm from './AbsenceForm';
import { toast } from 'sonner';

interface CreateAbsenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateAbsenceDialog: React.FC<CreateAbsenceDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSubmit = async (data: any) => {
    try {
      // In a real app, we would call a Firebase function here
      console.log("Creating absence request:", data);
      
      // Simulate a successful creation
      setTimeout(() => {
        toast.success("Demande d'absence créée avec succès");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la création de la demande d'absence:", error);
      toast.error("Erreur lors de la création de la demande d'absence");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande d'absence</DialogTitle>
        </DialogHeader>
        <AbsenceForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAbsenceDialog;
