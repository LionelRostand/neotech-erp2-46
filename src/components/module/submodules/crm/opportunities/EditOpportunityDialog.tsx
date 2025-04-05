
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Opportunity, OpportunityFormData } from '../types/crm-types';
import OpportunityForm from './OpportunityForm';

interface EditOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onUpdate: (opportunity: Opportunity) => void;
}

const EditOpportunityDialog: React.FC<EditOpportunityDialogProps> = ({
  isOpen,
  onClose,
  opportunity,
  onUpdate
}) => {
  const handleSubmit = (formData: OpportunityFormData) => {
    const updatedOpportunity: Opportunity = {
      ...opportunity,
      ...formData,
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedOpportunity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'opportunité</DialogTitle>
        </DialogHeader>
        <OpportunityForm
          initialData={opportunity}
          onSubmit={handleSubmit}
          buttonText="Mettre à jour"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditOpportunityDialog;
