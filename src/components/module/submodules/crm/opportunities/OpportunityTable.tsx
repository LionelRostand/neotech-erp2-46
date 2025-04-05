
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Opportunity } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { formatCurrency } from '@/lib/utils';

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
  onView,
  onEdit,
  onDelete
}) => {
  const { getStageLabel, getStageBadgeColor, getStageIcon } = useOpportunityUtils();
  
  // Format date for display
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  // If no opportunities, show empty state
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucune opportunité trouvée</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Étape</TableHead>
            <TableHead>Date de clôture</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map(opportunity => {
            const StageIcon = getStageIcon(opportunity.stage);
            return (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">
                  {opportunity.name || opportunity.title}
                </TableCell>
                <TableCell>{opportunity.clientName || "-"}</TableCell>
                <TableCell>{formatCurrency(opportunity.value || opportunity.amount || 0)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {StageIcon && <StageIcon className="h-4 w-4" />}
                    <Badge className={getStageBadgeColor(opportunity.stage)}>
                      {getStageLabel(opportunity.stage)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{formatDate(opportunity.closeDate || opportunity.expectedCloseDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(opportunity)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Voir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(opportunity)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(opportunity)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OpportunityTable;
