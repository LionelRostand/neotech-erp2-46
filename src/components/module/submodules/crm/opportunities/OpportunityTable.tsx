
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit2 } from "lucide-react";
import { Opportunity } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onEditClick: (opportunity: Opportunity) => void;
  onViewClick: (opportunity: Opportunity) => void;
  loading: boolean;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
  onEditClick,
  onViewClick,
  loading
}) => {
  const { getStageLabel, getStageIcon } = useOpportunityUtils();

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">Chargement des opportunités...</p>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">Aucune opportunité trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date de clôture</TableHead>
            <TableHead>Étape</TableHead>
            <TableHead>Probabilité</TableHead>
            <TableHead>Commercial</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell className="font-medium">{opportunity.title}</TableCell>
              <TableCell>{opportunity.clientName}</TableCell>
              <TableCell>{opportunity.amount.toLocaleString('fr-FR')} €</TableCell>
              <TableCell>
                {format(new Date(opportunity.expectedCloseDate), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-1">{getStageIcon(opportunity.stage)}</span>
                  {getStageLabel(opportunity.stage)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${opportunity.probability}%` }}
                    ></div>
                  </div>
                  <span>{opportunity.probability}%</span>
                </div>
              </TableCell>
              <TableCell>{opportunity.assignedTo || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewClick(opportunity)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditClick(opportunity)}>
                    <Edit2 className="h-4 w-4" />
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
