
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Opportunity } from '../types/crm-types';

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onViewClick: (opportunity: Opportunity) => void;
  onEditClick: (opportunity: Opportunity) => void;
  loading: boolean;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
  onViewClick,
  onEditClick,
  loading
}) => {
  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quote_sent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'won': return 'bg-green-100 text-green-800 border-green-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'new': return 'Nouvelle';
      case 'quote_sent': return 'Devis envoyé';
      case 'negotiation': return 'Négociation';
      case 'pending': return 'En attente';
      case 'won': return 'Gagnée';
      case 'lost': return 'Perdue';
      default: return stage;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucune opportunité trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opportunité</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Étape</TableHead>
            <TableHead>Date de clôture</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell className="font-medium">{opportunity.title || opportunity.company}</TableCell>
              <TableCell>{opportunity.clientName || opportunity.company}</TableCell>
              <TableCell>{formatCurrency(opportunity.amount || 0)}</TableCell>
              <TableCell>
                <Badge className={getStageBadgeColor(opportunity.stage)}>
                  {getStageLabel(opportunity.stage)}
                </Badge>
              </TableCell>
              <TableCell>{opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString('fr-FR') : '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewClick(opportunity)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditClick(opportunity)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OpportunityTable;
