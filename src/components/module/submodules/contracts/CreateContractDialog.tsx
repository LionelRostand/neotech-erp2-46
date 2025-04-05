
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
      // Make sure the data doesn't contain createdAt, as it's handled by formatDocumentWithTimestamps
      const contractData = { ...data };
      if (contractData.createdAt) {
        delete contractData.createdAt;
      }
      
      // Using the new collection path format for contracts
      await addDocument(COLLECTIONS.HR.CONTRACTS, contractData);
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
          <DialogDescription>
            Remplissez les informations pour créer un nouveau contrat
          </DialogDescription>
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
