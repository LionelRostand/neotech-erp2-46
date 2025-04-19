
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import IntegrationForm from './IntegrationForm';

interface AddIntegrationDialogProps {
  open: boolean;
  onClose: () => void;
  onIntegrationAdded: (integration: any) => void;
}

const AddIntegrationDialog: React.FC<AddIntegrationDialogProps> = ({
  open,
  onClose,
  onIntegrationAdded
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newIntegration = {
        id: `int-${Date.now()}`,
        status: 'pending',
        ...data
      };
      
      onIntegrationAdded(newIntegration);
      toast({
        title: "Intégration ajoutée",
        description: "L'intégration a été ajoutée avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'intégration.",
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
          <DialogTitle>Ajouter une nouvelle intégration</DialogTitle>
        </DialogHeader>
        <IntegrationForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddIntegrationDialog;
