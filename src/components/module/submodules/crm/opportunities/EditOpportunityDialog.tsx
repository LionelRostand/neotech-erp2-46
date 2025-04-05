
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Opportunity, OpportunityFormData } from '../types/crm-types';
import OpportunityForm from './OpportunityForm';

interface EditOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onEdit: (data: OpportunityFormData) => void;
}

const EditOpportunityDialog: React.FC<EditOpportunityDialogProps> = ({
  isOpen,
  onClose,
  opportunity,
  onEdit
}) => {
  const handleSubmit = (data: OpportunityFormData) => {
    onEdit(data);
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
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOpportunityDialog;
