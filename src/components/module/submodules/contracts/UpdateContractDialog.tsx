
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Contract } from '@/hooks/useContractsData';
import { toast } from '@/hooks/use-toast';
import { updateDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import ContractForm from './ContractForm';

interface UpdateContractDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractUpdated: () => void;
}

const UpdateContractDialog: React.FC<UpdateContractDialogProps> = ({
  contract,
  open,
  onOpenChange,
  onContractUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<any>(null);

  // Réinitialiser le formulaire quand le contrat change
  React.useEffect(() => {
    if (contract) {
      setFormData({
        employeeId: contract.employeeId,
        type: contract.type,
        startDate: contract.startDate,
        endDate: contract.endDate,
        position: contract.position,
        salary: contract.salary,
        // Ajout du departement
        department: contract.department,
      });
    } else {
      setFormData(null);
    }
  }, [contract]);

  const handleFormDataChange = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    if (!contract || !formData) return;
    
    try {
      setIsSubmitting(true);
      
      // Préparation des données à mettre à jour
      const contractData = {
        ...formData,
        // Conversion des dates si nécessaire
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDocument(COLLECTIONS.HR.CONTRACTS, contract.id, contractData);
      
      toast({
        title: "Contrat mis à jour",
        description: "Le contrat a été mis à jour avec succès.",
      });
      
      onContractUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrat:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du contrat.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Modifier le contrat</DialogTitle>
        </DialogHeader>
        
        {formData && (
          <ContractForm 
            initialData={formData} 
            onFormDataChange={handleFormDataChange} 
          />
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateContractDialog;
