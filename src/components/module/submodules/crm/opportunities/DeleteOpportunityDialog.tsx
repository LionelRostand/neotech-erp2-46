
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Opportunity } from '../types/crm-types';

interface DeleteOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onDelete: () => void;
}

const DeleteOpportunityDialog: React.FC<DeleteOpportunityDialogProps> = ({
  isOpen,
  onClose,
  opportunity,
  onDelete
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Supprimer l'opportunité</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette opportunité ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Nom de l'opportunité</p>
            <p className="text-sm">{opportunity.name}</p>
          </div>
          {opportunity.clientName && (
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-sm">{opportunity.clientName}</p>
            </div>
          )}
          {opportunity.value > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500">Valeur</p>
              <p className="text-sm">{opportunity.value} €</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOpportunityDialog;
