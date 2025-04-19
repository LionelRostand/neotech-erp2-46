
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import MedicalRecordForm from './MedicalRecordForm';

interface AddMedicalRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onRecordAdded: (record: any) => void;
  patients: { id: string; name: string }[];
}

const AddMedicalRecordDialog: React.FC<AddMedicalRecordDialogProps> = ({
  open,
  onClose,
  onRecordAdded,
  patients
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newRecord = {
        id: `mr-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...data
      };
      
      onRecordAdded(newRecord);
      toast({
        title: "Dossier médical créé",
        description: "Le dossier médical a été créé avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du dossier médical.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau dossier médical</DialogTitle>
        </DialogHeader>
        <MedicalRecordForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          patients={patients}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalRecordDialog;
