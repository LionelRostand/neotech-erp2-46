
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
  if (!client) return null;

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
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              console.log(`Confirmation de suppression du client: ${client.id}`);
              onConfirm();
              onOpenChange(false);
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
