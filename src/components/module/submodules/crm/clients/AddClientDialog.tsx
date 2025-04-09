
import React, { useState } from 'react';
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
import { Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Call the onAdd function with the current formData
    try {
      onAdd(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      // Reset submitting state after a short delay to show feedback
      setTimeout(() => setIsSubmitting(false), 500);
    }
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
