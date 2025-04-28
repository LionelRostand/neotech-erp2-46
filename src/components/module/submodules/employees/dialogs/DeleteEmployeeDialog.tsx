
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteEmployeeDialog: React.FC<DeleteEmployeeDialogProps> = ({ 
  employee, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!employee) return;
    
    try {
      setIsDeleting(true);
      await onConfirm(employee.id);
      toast.success("Employé supprimé avec succès");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-destructive">
            Supprimer l'employé
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer définitivement cet employé ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-destructive/10 rounded-md mb-4">
            <h3 className="font-medium">Détails de l'employé à supprimer :</h3>
            <p className="mt-2">
              <span className="font-medium">Nom:</span> {employee.firstName} {employee.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {employee.email}
            </p>
            <p>
              <span className="font-medium">Poste:</span> {employee.position || 'Non spécifié'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression en cours...' : 'Supprimer définitivement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeDialog;
