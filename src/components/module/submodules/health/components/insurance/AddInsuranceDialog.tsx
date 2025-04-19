
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import InsuranceForm from './InsuranceForm';

interface AddInsuranceDialogProps {
  open: boolean;
  onClose: () => void;
  onInsuranceAdded: (insurance: any) => void;
}

const AddInsuranceDialog: React.FC<AddInsuranceDialogProps> = ({
  open,
  onClose,
  onInsuranceAdded
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Ici, nous simulons l'ajout avec un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInsurance = {
        id: `ins-${Date.now()}`,
        status: 'active',
        ...data
      };
      
      onInsuranceAdded(newInsurance);
      toast({
        title: "Assurance ajoutée",
        description: "L'assurance a été ajoutée avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'assurance.",
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
          <DialogTitle>Ajouter une nouvelle assurance</DialogTitle>
        </DialogHeader>
        <InsuranceForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddInsuranceDialog;
