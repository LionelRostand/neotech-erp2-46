
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Opportunity, OpportunityFormData } from '../types/crm-types';
import OpportunityForm from './OpportunityForm';

interface AddOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (opportunity: Opportunity) => void;
}

const AddOpportunityDialog: React.FC<AddOpportunityDialogProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const handleSubmit = (formData: OpportunityFormData) => {
    const newOpportunity: Opportunity = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAdd(newOpportunity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle opportunité</DialogTitle>
        </DialogHeader>
        <OpportunityForm
          onSubmit={handleSubmit}
          buttonText="Créer l'opportunité"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddOpportunityDialog;
