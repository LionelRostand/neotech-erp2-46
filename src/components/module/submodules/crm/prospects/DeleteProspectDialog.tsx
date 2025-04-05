
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
import { Prospect } from '../types/crm-types';

interface DeleteProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onDelete: () => void;
}

const DeleteProspectDialog: React.FC<DeleteProspectDialogProps> = ({
  isOpen,
  onClose,
  prospect,
  onDelete
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Supprimer le prospect</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce prospect ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 p-4 border rounded-md">
          <p><strong>Entreprise:</strong> {prospect.company}</p>
          <p><strong>Contact:</strong> {prospect.contactName || prospect.name}</p>
          <p><strong>Email:</strong> {prospect.contactEmail || prospect.email}</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProspectDialog;
