
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Client } from '../types/crm-types';

interface DeleteClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onConfirm: () => void;
}

const DeleteClientDialog: React.FC<DeleteClientDialogProps> = ({
  isOpen,
  onOpenChange,
  client,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Reset deleting state when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!client) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      // The dialog will be closed by the parent component if deletion is successful
    } catch (error) {
      console.error("Error in delete handler:", error);
      setIsDeleting(false);
      // Error is handled in the parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Supprimer le client
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le client <span className="font-semibold">{client.name}</span> ? 
            Cette action est irréversible et supprimera toutes les données associées.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
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
              "Supprimer définitivement"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClientDialog;
