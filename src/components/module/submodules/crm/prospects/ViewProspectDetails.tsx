
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prospect } from '../types/crm-types';
import ProspectDetails from './ProspectDetails';

interface ViewProspectDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onEdit?: () => void;
}

const ViewProspectDetails: React.FC<ViewProspectDetailsProps> = ({
  isOpen,
  onClose,
  prospect,
  onEdit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Détails du prospect</DialogTitle>
        </DialogHeader>
        
        <ProspectDetails prospect={prospect} onClose={onClose} />
        
        <DialogFooter className="space-x-2">
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              Modifier
            </Button>
          )}
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProspectDetails;
