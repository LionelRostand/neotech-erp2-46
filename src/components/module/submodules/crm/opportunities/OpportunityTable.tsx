
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Opportunity } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onViewDetails: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const { getStageBadgeClass, getStageText, formatAmount, formatDate } = useOpportunityUtils();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Valeur</TableHead>
            <TableHead>Date de clôture</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucune opportunité trouvée
              </TableCell>
            </TableRow>
          ) : (
            opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">{opportunity.title}</TableCell>
                <TableCell>{opportunity.clientName || opportunity.title}</TableCell>
                <TableCell>{formatAmount(opportunity.value)}</TableCell>
                <TableCell>{opportunity.expectedCloseDate ? formatDate(opportunity.expectedCloseDate) : 'Non définie'}</TableCell>
                <TableCell>
                  <Badge className={getStageBadgeClass(opportunity.stage)}>
                    {getStageText(opportunity.stage)}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(opportunity)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(opportunity)}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(opportunity)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OpportunityTable;
