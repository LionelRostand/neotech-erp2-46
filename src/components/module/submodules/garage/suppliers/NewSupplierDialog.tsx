
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewSupplierForm from './NewSupplierForm';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface NewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NewSupplierDialog = ({ open, onOpenChange, onSuccess }: NewSupplierDialogProps) => {
  const handleSave = async (supplier: any) => {
    try {
      await addDocument(COLLECTIONS.GARAGE.SUPPLIERS, supplier);
      toast.success("Fournisseur ajouté avec succès");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast.error("Erreur lors de l'ajout du fournisseur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Fournisseur</DialogTitle>
        </DialogHeader>
        <NewSupplierForm onSubmit={handleSave} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewSupplierDialog;
