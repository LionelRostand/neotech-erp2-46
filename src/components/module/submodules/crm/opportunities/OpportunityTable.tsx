import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, Trash2 } from "lucide-react";
import { Opportunity } from '../types/crm-types';
import { formatCurrency } from "@/lib/utils";

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
  isLoading: boolean;
  error: string;
}

const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
  onView,
  onEdit,
  onDelete,
  isLoading,
  error
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Chargement des opportunités...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erreur: {error}</div>;
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">Aucune opportunité trouvée</p>
        <p className="text-sm text-gray-400 mt-1">Utilisez le bouton "Ajouter une opportunité" pour créer une nouvelle opportunité</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Valeur</TableHead>
            <TableHead>Étape</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell className="font-medium">{opportunity.name}</TableCell>
              <TableCell>{formatCurrency(opportunity.value)}</TableCell>
              <TableCell>
                {opportunity.stage === 'new' && (
                  <Badge className="bg-gray-500">Nouveau</Badge>
                )}
                {opportunity.stage === 'negotiation' && (
                  <Badge className="bg-blue-500">Négociation</Badge>
                )}
                {opportunity.stage === 'quote' && (
                  <Badge className="bg-amber-500">Devis envoyé</Badge>
                )}
                {opportunity.stage === 'pending' && (
                  <Badge className="bg-purple-500">En attente</Badge>
                )}
                {opportunity.stage === 'won' && (
                  <Badge className="bg-green-500">Gagné</Badge>
                )}
                {opportunity.stage === 'closed_lost' && (
                  <Badge className="bg-red-500">Perdu</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onView(opportunity)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(opportunity)}>
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(opportunity)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OpportunityTable;
