
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from './ClientForm';
import { useClientForm } from '../hooks/useClientForm';
import { SalonClient } from '../../types/salon-types';

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (client: SalonClient) => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  isOpen,
  onOpenChange,
  onAdd
}) => {
  const { formData, formErrors, resetForm, updateFormField, validateForm } = useClientForm();

  const handleSubmit = () => {
    if (validateForm()) {
      const newClient: SalonClient = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        lastVisit: null,
        visits: [],
        appointments: [],
        loyaltyPoints: 0
      };
      
      onAdd(newClient);
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
        </DialogHeader>
        
        <ClientForm 
          formData={formData} 
          formErrors={formErrors} 
          onChange={updateFormField} 
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
