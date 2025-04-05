
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
import { AlertTriangle } from 'lucide-react';

interface Insurance {
  id: string;
  name: string;
}

interface DeleteInsuranceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  insurance: Insurance;
  onDelete: (id: string) => void;
}

const DeleteInsuranceDialog: React.FC<DeleteInsuranceDialogProps> = ({
  isOpen,
  onClose,
  insurance,
  onDelete
}) => {
  const handleDelete = () => {
    onDelete(insurance.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle>Supprimer l'assurance</DialogTitle>
          <DialogDescription className="text-center">
            Êtes-vous sûr de vouloir supprimer l'assurance <strong>{insurance.name}</strong> ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInsuranceDialog;
