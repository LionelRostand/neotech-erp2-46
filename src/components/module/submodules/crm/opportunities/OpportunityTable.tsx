
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { Opportunity } from '../types/crm-types';
import { formatCurrency } from '@/lib/utils';

interface OpportunityTableProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({ 
  opportunities, 
  isLoading,
  error,
  onView,
  onEdit,
  onDelete
}) => {
  const opportunityUtils = useOpportunityUtils();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Une erreur est survenue lors du chargement des opportunités</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opportunité</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Étape</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                Aucune opportunité trouvée
              </TableCell>
            </TableRow>
          ) : (
            opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">{opportunity.name}</TableCell>
                <TableCell>{opportunity.clientName || 'Non défini'}</TableCell>
                <TableCell>
                  <Badge className={opportunityUtils.getStageColor(opportunity.stage)}>
                    {opportunityUtils.getStageLabel(opportunity.stage)}
                  </Badge>
                </TableCell>
                <TableCell>{opportunity.value ? formatCurrency(opportunity.value) : 'Non défini'}</TableCell>
                <TableCell>{opportunity.assignedTo || 'Non assigné'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onView(opportunity)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(opportunity)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(opportunity)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
