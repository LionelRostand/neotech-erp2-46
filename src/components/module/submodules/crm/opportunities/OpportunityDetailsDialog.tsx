
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Edit } from "lucide-react";
import { Opportunity } from '../types/crm-types';

export interface OpportunityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
  onEdit: () => void;
}

const OpportunityDetailsDialog: React.FC<OpportunityDetailsDialogProps> = ({
  open,
  onOpenChange,
  opportunity,
  onEdit
}) => {
  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center">
            <span>Détails de l'opportunité</span>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">{opportunity.title || opportunity.company}</h3>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Client</span>
                <p className="font-medium">{opportunity.clientName || opportunity.company}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Montant</span>
                <p className="font-medium text-lg">
                  {formatCurrency(opportunity.amount || 0)}
                </p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Probabilité</span>
                <p className="font-medium">{opportunity.probability || 0}%</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Étape</span>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                    {opportunity.stage || 'Nouvelle'}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Date de clôture prévue</span>
                <p className="font-medium">
                  {opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString('fr-FR') : 'Non définie'}
                </p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Responsable</span>
                <p className="font-medium">{opportunity.assignedTo || 'Non assigné'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Produits / Services</h3>

            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">Produit</th>
                    <th className="py-2 px-3 text-right text-sm font-medium text-muted-foreground">Qté</th>
                    <th className="py-2 px-3 text-right text-sm font-medium text-muted-foreground">Prix</th>
                    <th className="py-2 px-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(opportunity.products || []).map((product: any) => (
                    <tr key={product.id}>
                      <td className="py-2 px-3 text-sm">{product.name}</td>
                      <td className="py-2 px-3 text-sm text-right">{product.quantity}</td>
                      <td className="py-2 px-3 text-sm text-right">{formatCurrency(product.unitPrice)}</td>
                      <td className="py-2 px-3 text-sm text-right">{formatCurrency(product.totalPrice)}</td>
                    </tr>
                  ))}
                  {(opportunity.products || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-3 px-3 text-center text-sm text-muted-foreground">
                        Aucun produit ou service associé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {opportunity.notes || 'Aucune note'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailsDialog;
