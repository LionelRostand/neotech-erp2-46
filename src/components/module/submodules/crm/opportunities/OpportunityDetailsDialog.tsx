
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
import { Opportunity, OpportunityStage } from '../types/crm-types';
import { formatDate } from '@/lib/utils';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunityDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
}

const OpportunityDetailsDialog: React.FC<OpportunityDetailsDialogProps> = ({
  isOpen,
  onClose,
  opportunity
}) => {
  const { getStageBadgeClass, getStageText, formatAmount } = useOpportunityUtils();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Détails de l'opportunité</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{opportunity.title}</h2>
              {opportunity.clientName && <p className="text-muted-foreground">Client: {opportunity.clientName}</p>}
            </div>
            <Badge className={getStageBadgeClass(opportunity.stage)}>
              {getStageText(opportunity.stage)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Informations de contact</h3>
              <div className="space-y-1 text-sm">
                {opportunity.clientName && <p><strong>Client:</strong> {opportunity.clientName}</p>}
                {opportunity.contactName && <p><strong>Contact:</strong> {opportunity.contactName}</p>}
                {opportunity.contactEmail && (
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${opportunity.contactEmail}`} className="text-blue-600 hover:underline">
                      {opportunity.contactEmail}
                    </a>
                  </p>
                )}
                {opportunity.contactPhone && (
                  <p>
                    <strong>Téléphone:</strong>{' '}
                    <a href={`tel:${opportunity.contactPhone}`} className="text-blue-600 hover:underline">
                      {opportunity.contactPhone}
                    </a>
                  </p>
                )}
                {opportunity.assignedTo && <p><strong>Assigné à:</strong> {opportunity.assignedTo}</p>}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Détails commerciaux</h3>
              <div className="space-y-1 text-sm">
                {opportunity.value !== undefined && (
                  <p><strong>Valeur:</strong> {formatAmount(opportunity.value)}</p>
                )}
                {opportunity.probability !== undefined && (
                  <p><strong>Probabilité:</strong> {opportunity.probability}%</p>
                )}
                {opportunity.expectedCloseDate && (
                  <p><strong>Date de clôture prévue:</strong> {formatDate(opportunity.expectedCloseDate)}</p>
                )}
                <p><strong>Créée le:</strong> {formatDate(opportunity.createdAt)}</p>
              </div>
            </div>
          </div>
          
          {opportunity.products && opportunity.products.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Produits</h3>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunity.products.map((product, index) => (
                      <tr key={product.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAmount(product.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAmount(product.price * product.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {opportunity.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm whitespace-pre-line">{opportunity.description}</p>
            </div>
          )}
          
          {opportunity.notes && (
            <div>
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm whitespace-pre-line">{opportunity.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailsDialog;
