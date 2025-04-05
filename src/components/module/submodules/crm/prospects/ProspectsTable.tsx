
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, UserCheck, Bell } from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectsTableProps {
  prospects: Prospect[];
  onEdit: (prospect: Prospect) => void;
  onDelete: (prospect: Prospect) => void;
  onViewDetails: (prospect: Prospect) => void;
  onConvert: (prospect: Prospect) => void;
  onReminder: (prospect: Prospect) => void;
}

const ProspectsTable: React.FC<ProspectsTableProps> = ({
  prospects,
  onEdit,
  onDelete,
  onViewDetails,
  onConvert,
  onReminder
}) => {
  // Helper function to get the badge class based on status
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'proposal':
        return 'bg-amber-100 text-amber-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status display text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'meeting':
        return 'Rendez-vous';
      case 'proposal':
        return 'Proposition';
      case 'negotiation':
        return 'Négociation';
      case 'converted':
        return 'Converti';
      case 'lost':
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Société</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Aucun prospect trouvé
              </TableCell>
            </TableRow>
          ) : (
            prospects.map((prospect) => (
              <TableRow key={prospect.id}>
                <TableCell className="font-medium">{prospect.company}</TableCell>
                <TableCell>{prospect.contactName}</TableCell>
                <TableCell>{prospect.contactEmail}</TableCell>
                <TableCell>{prospect.contactPhone}</TableCell>
                <TableCell>{prospect.source}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(prospect.status)}>
                    {getStatusText(prospect.status)}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(prospect)} title="Voir les détails">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(prospect)} title="Modifier">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onReminder(prospect)} title="Ajouter un rappel">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onConvert(prospect)} title="Convertir en client">
                    <UserCheck className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(prospect)} title="Supprimer">
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

export default ProspectsTable;
