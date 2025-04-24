
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGarageRepairs } from '@/hooks/garage/useGarageRepairs';
import { cn } from '@/lib/utils';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'awaiting_parts':
      return 'bg-amber-100 text-amber-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'awaiting_approval':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'En cours';
    case 'awaiting_parts':
      return 'En attente de pièces';
    case 'completed':
      return 'Terminé';
    case 'awaiting_approval':
      return 'En attente d\'approbation';
    default:
      return status;
  }
};

export const RepairsTable = () => {
  const { repairs, loading, error } = useGarageRepairs();

  // Ajouter des logs pour déboguer
  console.log('RepairsTable - repairs:', repairs);
  console.log('RepairsTable - loading:', loading);
  console.log('RepairsTable - error:', error);

  if (loading) {
    return <div className="text-center py-4">Chargement des réparations...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erreur: {error.message}</div>;
  }

  if (repairs.length === 0) {
    return <div className="text-center py-4">Aucune réparation trouvée.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Mécanicien</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Progression</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repairs.map((repair) => (
          <TableRow key={repair.id}>
            <TableCell>{repair.startDate || repair.createdAt?.split('T')[0] || 'N/A'}</TableCell>
            <TableCell>{repair.clientName}</TableCell>
            <TableCell>{repair.vehicleName}</TableCell>
            <TableCell>{repair.mechanicName}</TableCell>
            <TableCell className="max-w-xs truncate">{repair.description}</TableCell>
            <TableCell>
              <Badge className={cn(getStatusColor(repair.status))}>
                {getStatusText(repair.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${repair.progress || 0}%` }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
