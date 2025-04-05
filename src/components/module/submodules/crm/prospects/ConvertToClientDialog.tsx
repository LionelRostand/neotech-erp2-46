
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

interface ConvertToClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onConvert: () => void;
}

const ConvertToClientDialog: React.FC<ConvertToClientDialogProps> = ({
  isOpen,
  onClose,
  prospect,
  onConvert
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convertir en client</DialogTitle>
          <DialogDescription>
            Voulez-vous convertir ce prospect en client ? Les informations seront transférées dans la section clients.
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
            onClick={onConvert}
          >
            Convertir en client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertToClientDialog;
