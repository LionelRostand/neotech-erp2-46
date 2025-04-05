
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prospect, ProspectFormData } from '../types/crm-types';
import ProspectForm from './ProspectForm';

interface EditProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onUpdate: (data: ProspectFormData) => void;
}

const EditProspectDialog: React.FC<EditProspectDialogProps> = ({
  isOpen,
  onClose,
  prospect,
  onUpdate
}) => {
  const handleSubmit = (data: ProspectFormData) => {
    onUpdate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le prospect</DialogTitle>
        </DialogHeader>
        
        <ProspectForm 
          initialData={prospect} 
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

export default EditProspectDialog;
