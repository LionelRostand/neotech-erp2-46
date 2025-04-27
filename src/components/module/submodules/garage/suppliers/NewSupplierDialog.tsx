
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewSupplierForm from './NewSupplierForm';
import { useGarageSuppliers } from '@/hooks/garage/useGarageSuppliers';

interface NewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NewSupplierDialog = ({ open, onOpenChange, onSuccess }: NewSupplierDialogProps) => {
  const { addSupplier } = useGarageSuppliers();

  const handleSave = async (supplierData: any) => {
    try {
      await addSupplier.mutateAsync(supplierData);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving supplier:', error);
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
