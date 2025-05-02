
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Company } from '../types';
import { companyService } from '../services/companyService';
import { toast } from 'sonner';

interface DeleteCompanyDialogProps {
  company: Company;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DeleteCompanyDialog: React.FC<DeleteCompanyDialogProps> = ({
  company,
  open,
  onClose,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Return early if company is undefined or null
  if (!company || !company.id) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await companyService.deleteCompany(company.id);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        toast.success("L'entreprise a été supprimée avec succès");
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error("Une erreur est survenue lors de la suppression de l'entreprise");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette entreprise ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer <strong>{company.name}</strong>.<br />
            Cette action est irréversible et supprimera définitivement les données de l'entreprise.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Suppression en cours...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCompanyDialog;
