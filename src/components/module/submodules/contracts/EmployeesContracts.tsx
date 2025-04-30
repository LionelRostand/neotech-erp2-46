
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { formatDate } from '@/lib/formatters';
import { useContractsData } from '@/hooks/useContractsData';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const EmployeesContracts = () => {
  const { contracts, isLoading, error } = useContractsData();

  // Définir les colonnes pour le tableau des contrats
  const columns = useMemo(() => [
    {
      header: 'Employé',
      accessorKey: 'employeeName',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.employeePhoto && (
            <img 
              src={row.original.employeePhoto} 
              alt={row.original.employeeName} 
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{row.original.employeeName}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Poste',
      accessorKey: 'position',
    },
    {
      header: 'Date de début',
      accessorKey: 'startDate',
    },
    {
      header: 'Date de fin',
      accessorKey: 'endDate',
      cell: ({ row }) => row.original.endDate || 'N/A'
    },
    {
      header: 'Département',
      accessorKey: 'department',
      cell: ({ row }) => row.original.department || 'Non spécifié'
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        let variant = "default";
        
        if (status === 'Actif') variant = "success";
        else if (status === 'À venir') variant = "secondary";
        else if (status === 'Expiré') variant = "destructive";
        
        return (
          <Badge 
            variant={variant === "success" ? "default" : variant} 
            className={variant === "success" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {status}
          </Badge>
        );
      }
    }
  ], []);

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Liste des contrats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Une erreur est survenue lors du chargement des données.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Liste des contrats</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={contracts}
          isLoading={isLoading}
          emptyMessage="Aucun contrat disponible"
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesContracts;
