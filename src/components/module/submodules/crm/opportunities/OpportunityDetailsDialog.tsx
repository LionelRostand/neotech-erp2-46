
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Phone, Mail, Building, User, Clock, DollarSign, FileText, Target, Tag } from "lucide-react";
import { Opportunity } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { formatCurrency } from '@/lib/utils';

interface OpportunityDetailsDialogProps {
  opportunity: Opportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const OpportunityDetailsDialog: React.FC<OpportunityDetailsDialogProps> = ({
  opportunity,
  open,
  onOpenChange,
  onEdit,
  onDelete
}) => {
  const { getStageBadgeColor, getStageLabel } = useOpportunityUtils();

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Format probability function
  const formatProbability = (probability?: number) => {
    if (probability === undefined || probability === null) return 'Non défini';
    return `${probability}%`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl">
              {opportunity.name || opportunity.title}
            </DialogTitle>
            <Badge className={getStageBadgeColor(opportunity.stage)}>
              {getStageLabel(opportunity.stage)}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Montant:</span>
                <span className="text-sm">{formatCurrency(opportunity.value || opportunity.amount || 0)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Probabilité:</span>
                <span className="text-sm">{formatProbability(opportunity.probability)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Date de début:</span>
                <span className="text-sm">{formatDate(opportunity.startDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Date de clôture prévue:</span>
                <span className="text-sm">{formatDate(opportunity.closeDate || opportunity.expectedCloseDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Source:</span>
                <span className="text-sm">{opportunity.source || 'Non définie'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Assigné à:</span>
                <span className="text-sm">{opportunity.assignedTo || 'Non assigné'}</span>
              </div>
            </div>
            
            {opportunity.description && (
              <div className="mt-4">
                <FileText className="h-4 w-4 text-gray-500 inline mr-2" />
                <span className="text-sm font-medium">Description:</span>
                <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">{opportunity.description}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">{opportunity.clientName || 'Client'}</h3>
              
              {opportunity.contactName && (
                <div className="flex items-center gap-2 mt-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{opportunity.contactName}</span>
                </div>
              )}
              
              {opportunity.contactEmail && (
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{opportunity.contactEmail}</span>
                </div>
              )}
              
              {opportunity.contactPhone && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{opportunity.contactPhone}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            {opportunity.products && opportunity.products.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunity.products.map((product, index) => {
                      if (typeof product === 'string') {
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan={4}>{product}</td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={product.id || index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{product.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(product.unitPrice)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(product.totalPrice)}</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucun produit associé à cette opportunité
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {opportunity.notes ? (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm whitespace-pre-line">{opportunity.notes}</p>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucune note pour cette opportunité
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6">
          <div>
            {onDelete && (
              <Button variant="destructive" onClick={onDelete} className="mr-2">
                Supprimer
              </Button>
            )}
          </div>
          
          <div>
            {onEdit && (
              <Button variant="outline" onClick={onEdit} className="mr-2">
                Modifier
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)}>Fermer</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailsDialog;
