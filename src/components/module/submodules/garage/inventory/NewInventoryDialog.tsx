
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryItem } from '@/hooks/garage/useGarageInventory';
import NewInventoryForm from './NewInventoryForm';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface NewInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NewInventoryDialog = ({ open, onOpenChange, onSuccess }: NewInventoryDialogProps) => {
  const handleSave = async (data: Partial<InventoryItem>) => {
    try {
      const newItem = {
        ...data,
        status: data.quantity === 0 ? 'out_of_stock' :
                data.quantity <= (data.minQuantity || 0) ? 'low_stock' : 
                'in_stock'
      };
      
      await addDocument(COLLECTIONS.GARAGE.INVENTORY, newItem);
      toast.success("Article ajouté avec succès");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.error("Erreur lors de l'ajout de l'article");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvel Article</DialogTitle>
        </DialogHeader>
        <NewInventoryForm onSubmit={handleSave} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewInventoryDialog;
