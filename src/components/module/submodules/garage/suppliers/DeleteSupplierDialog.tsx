
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GarageSupplier } from '@/hooks/garage/useGarageSuppliers';

interface DeleteSupplierDialogProps {
  supplier: GarageSupplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const DeleteSupplierDialog = ({ supplier, open, onOpenChange, onConfirm }: DeleteSupplierDialogProps) => {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le fournisseur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le fournisseur {supplier.name} ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSupplierDialog;
