
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
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
  const opportunityUtils = useOpportunityUtils();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{opportunity.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-sm">{opportunity.clientName || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stade</p>
              <Badge className={opportunityUtils.getStageColor(opportunity.stage)}>
                {opportunityUtils.getStageLabel(opportunity.stage)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Montant</p>
              <p className="text-sm">{opportunity.amount ? `${opportunity.amount} €` : 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Responsable</p>
              <p className="text-sm">{opportunity.assignedTo || 'Non assigné'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm">{opportunity.description || 'Aucune description'}</p>
            </div>
          </div>
          
          {opportunity.products && opportunity.products.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Produits</p>
              <ul className="space-y-2">
                {opportunity.products.map((product, index) => (
                  <li key={index} className="text-sm">
                    {product.name} - {product.quantity} x {product.price}€
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
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
