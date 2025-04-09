
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
import { toast } from 'sonner';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation basique
    if (!formData.name.trim()) {
      toast.error("Le nom du client est requis");
      setIsSubmitting(false);
      return;
    }
    
    // Call the onAdd function with the current formData
    try {
      await onAdd(formData);
      toast.success(`Client "${formData.name}" ajouté avec succès`);
      onClose(); // Ferme le dialog après succès
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur lors de l'ajout du client: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isSubmitting) onClose();
    }}>
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
