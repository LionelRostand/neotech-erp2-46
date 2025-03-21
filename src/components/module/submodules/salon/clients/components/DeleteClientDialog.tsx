
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
import { AlertTriangle } from "lucide-react";

interface DeleteClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onConfirm: () => void;
}

const DeleteClientDialog: React.FC<DeleteClientDialogProps> = ({
  isOpen,
  onOpenChange,
  clientName,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Supprimer le client
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le client <span className="font-semibold">{clientName}</span> ? 
            Cette action est irréversible et supprimera toutes les données associées, y compris l'historique des rendez-vous 
            et les points de fidélité.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
            }}
          >
            Supprimer définitivement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClientDialog;
