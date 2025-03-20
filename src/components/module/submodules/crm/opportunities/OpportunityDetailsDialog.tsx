
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, DollarSign, Calendar, User, FileText, ClipboardList } from "lucide-react";
import { Opportunity } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OpportunityDetailsDialogProps {
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
  const { getStageLabel, getStageColor } = useOpportunityUtils();
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{opportunity.title}</span>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`p-2 mr-3 rounded-md ${getStageColor(opportunity.stage)}`}>
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant</p>
                <p className="font-medium">{opportunity.amount.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-md bg-blue-100">
                <div 
                  className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium bg-blue-500 text-white"
                >
                  {opportunity.probability}%
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Probabilité</p>
                <p className="font-medium">{opportunity.probability}%</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium">{opportunity.clientName}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Étape</p>
              <div className="flex items-center">
                <span 
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${getStageColor(opportunity.stage)}`}
                ></span>
                <p className="font-medium">{getStageLabel(opportunity.stage)}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date de clôture prévue</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <p>{formatDate(opportunity.expectedCloseDate)}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Commercial assigné</p>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <p>{opportunity.assignedTo || 'Non assigné'}</p>
              </div>
            </div>
          </div>
          
          {opportunity.notes && (
            <div className="border rounded-md p-4">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2 text-gray-400" />
                <p className="font-medium">Notes</p>
              </div>
              <p className="text-sm whitespace-pre-line">{opportunity.notes}</p>
            </div>
          )}
          
          {opportunity.products && opportunity.products.length > 0 && (
            <div className="border rounded-md p-4">
              <div className="flex items-center mb-3">
                <ClipboardList className="h-4 w-4 mr-2 text-gray-400" />
                <p className="font-medium">Produits / Services</p>
              </div>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="pb-2">Produit</th>
                    <th className="pb-2 text-right">Quantité</th>
                    <th className="pb-2 text-right">Prix unitaire</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunity.products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-1">{product.name}</td>
                      <td className="py-1 text-right">{product.quantity}</td>
                      <td className="py-1 text-right">{product.unitPrice.toLocaleString('fr-FR')} €</td>
                      <td className="py-1 text-right">{product.totalPrice.toLocaleString('fr-FR')} €</td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td colSpan={3} className="pt-2 text-right">Total</td>
                    <td className="pt-2 text-right">
                      {opportunity.products.reduce((sum, product) => sum + product.totalPrice, 0).toLocaleString('fr-FR')} €
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-between text-sm text-gray-500">
            <p>Créé le {formatDate(opportunity.createdAt)}</p>
            <p>Mis à jour le {formatDate(opportunity.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailsDialog;
