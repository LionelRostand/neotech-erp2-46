
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProspectFormData } from '../types/crm-types';
import ProspectForm from './ProspectForm';

interface AddProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ProspectFormData) => void;
}

const AddProspectDialog: React.FC<AddProspectDialogProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const handleSubmit = (data: ProspectFormData) => {
    onAdd(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un prospect</DialogTitle>
        </DialogHeader>
        
        <ProspectForm onSubmit={handleSubmit} />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProspectDialog;
