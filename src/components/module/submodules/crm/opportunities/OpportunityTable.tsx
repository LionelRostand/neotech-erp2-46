
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
import { Edit, Eye } from "lucide-react";
import { Opportunity } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

export interface OpportunityTableProps {
  opportunities: Opportunity[];
  onEditClick: (opportunity: Opportunity) => void;
  onViewClick: (opportunity: Opportunity) => void;
  loading?: boolean;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({ 
  opportunities, 
  onEditClick,
  onViewClick,
  loading = false
}) => {
  const { getStageBadgeClass } = useOpportunityUtils();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucune opportunité trouvée</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Étape</TableHead>
          <TableHead>Valeur</TableHead>
          <TableHead>Date de clôture</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map(opportunity => (
          <TableRow key={opportunity.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{opportunity.name}</TableCell>
            <TableCell>{opportunity.clientName}</TableCell>
            <TableCell>
              <Badge className={getStageBadgeClass(opportunity.stage)}>
                {opportunity.stage}
              </Badge>
            </TableCell>
            <TableCell>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(opportunity.value))}</TableCell>
            <TableCell>{new Date(opportunity.expectedCloseDate).toLocaleDateString('fr-FR')}</TableCell>
            <TableCell>{opportunity.owner}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewClick(opportunity)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditClick(opportunity)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OpportunityTable;
