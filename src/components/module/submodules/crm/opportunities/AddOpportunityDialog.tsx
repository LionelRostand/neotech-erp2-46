
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OpportunityFormData } from '../types/crm-types';
import OpportunityForm from './OpportunityForm';

interface AddOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: OpportunityFormData) => void;
}

const AddOpportunityDialog: React.FC<AddOpportunityDialogProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const handleSubmit = (data: OpportunityFormData) => {
    onAdd(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une opportunité</DialogTitle>
        </DialogHeader>
        
        <OpportunityForm onSubmit={handleSubmit} />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOpportunityDialog;
