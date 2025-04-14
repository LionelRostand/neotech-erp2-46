
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import ContractForm from './ContractForm';

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractCreated: () => void;
}

const CreateContractDialog: React.FC<CreateContractDialogProps> = ({
  open,
  onOpenChange,
  onContractCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'CDI',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    position: '',
    salary: '',
    department: '',
  });

  const handleFormDataChange = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    // Validation de base
    if (!formData.employeeId) {
      toast.error("Veuillez sélectionner un employé.");
      return;
    }

    if (!formData.position) {
      toast.error("Veuillez indiquer le poste.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Préparation des données pour Firebase
      const contractData = {
        ...formData,
        // Convertir le salaire en nombre si présent
        salary: formData.salary ? parseFloat(formData.salary) : null,
        // S'assurer que la date de fin est null si non renseignée
        endDate: formData.endDate || null,
        // Ajouter les timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Ajouter le contrat à Firebase
      await addDocument(COLLECTIONS.HR.CONTRACTS, contractData);
      
      toast.success("Le contrat a été créé avec succès.");
      
      // Réinitialiser le formulaire et fermer le dialogue
      setFormData({
        employeeId: '',
        type: 'CDI',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        position: '',
        salary: '',
        department: '',
      });
      
      onContractCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
      toast.error("Une erreur est survenue lors de la création du contrat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Nouveau contrat</DialogTitle>
        </DialogHeader>
        
        <ContractForm 
          onFormDataChange={handleFormDataChange} 
        />
        
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
            {isSubmitting ? "Création..." : "Créer le contrat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractDialog;
