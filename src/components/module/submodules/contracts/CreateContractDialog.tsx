
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContractForm from './ContractForm';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateContractDialog: React.FC<CreateContractDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSubmit = async (data: any) => {
    try {
      await addDocument(COLLECTIONS.HR.CONTRACTS, data);
      toast.success("Contrat créé avec succès");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
      toast.error("Erreur lors de la création du contrat");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau contrat</DialogTitle>
        </DialogHeader>
        <ContractForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractDialog;
