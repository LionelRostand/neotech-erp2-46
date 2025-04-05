
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Opportunity } from '../types/crm-types';

export interface OpportunityDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onEdit: () => void;
}

const OpportunityDetailsDialog: React.FC<OpportunityDetailsDialogProps> = ({
  isOpen,
  onClose,
  opportunity,
  onEdit
}) => {
  if (!opportunity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de l'opportunité</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Nom</h3>
              <p>{opportunity.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Valeur</h3>
              <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(opportunity.value))}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Client</h3>
              <p>{opportunity.clientName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Étape</h3>
              <p>{opportunity.stage}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Date de clôture prévue</h3>
              <p>{new Date(opportunity.expectedCloseDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Responsable</h3>
              <p>{opportunity.owner}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Description</h3>
            <p className="whitespace-pre-wrap">{opportunity.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Produits/Services</h3>
            <p>{opportunity.products}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={onEdit}>
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailsDialog;
