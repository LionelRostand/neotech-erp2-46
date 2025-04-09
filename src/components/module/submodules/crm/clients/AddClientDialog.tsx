
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
import { ClientFormData } from '../types/crm-types';

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: ClientFormData) => void;
  formData: ClientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  sectorOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  formData,
  handleInputChange,
  handleSelectChange,
  sectorOptions,
  statusOptions
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <ClientForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            sectorOptions={sectorOptions}
            statusOptions={statusOptions}
          />
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
