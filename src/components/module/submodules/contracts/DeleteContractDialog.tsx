
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Contract } from '@/hooks/useContractsData';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { deleteDocument } from '@/hooks/firestore/delete-operations';

interface DeleteContractDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const DeleteContractDialog: React.FC<DeleteContractDialogProps> = ({ 
  contract, 
  open, 
  onOpenChange,
  onDeleteSuccess
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!contract || !contract.id) {
      toast.error("Impossible de supprimer ce contrat: identifiant manquant");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDocument(COLLECTIONS.HR.CONTRACTS, contract.id);
      toast.success("Le contrat a été supprimé avec succès");
      onOpenChange(false);
      onDeleteSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat:", error);
      toast.error("Une erreur s'est produite lors de la suppression du contrat");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer ce contrat</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le contrat de <strong>{contract.employeeName}</strong> ? 
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4 gap-2 sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContractDialog;
