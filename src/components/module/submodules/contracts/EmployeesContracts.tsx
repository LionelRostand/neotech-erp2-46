
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useContractsData } from '@/hooks/useContractsData';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const EmployeesContracts = () => {
  const { contracts, isLoading, error } = useContractsData();
  
  // Ensure contracts is always a valid array
  const safeContracts = Array.isArray(contracts) ? contracts.filter(Boolean) : [];
  
  console.log(`EmployeesContracts: Rendering with ${safeContracts.length} contracts`);

  // Définir les colonnes pour le tableau des contrats
  const columns = useMemo(() => [
    {
      header: 'Employé',
      accessorKey: 'employeeName',
      cell: ({ row }) => {
        const employeeName = row.original?.employeeName || 'Employé inconnu';
        const employeePhoto = row.original?.employeePhoto || '';
        
        return (
          <div className="flex items-center gap-2">
            {employeePhoto && (
              <img 
                src={employeePhoto} 
                alt={employeeName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span>{employeeName}</span>
          </div>
        );
      }
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => row.original?.type || 'Non spécifié'
    },
    {
      header: 'Poste',
      accessorKey: 'position',
      cell: ({ row }) => row.original?.position || 'Non spécifié'
    },
    {
      header: 'Date de début',
      accessorKey: 'startDate',
      cell: ({ row }) => row.original?.startDate || 'Non spécifiée'
    },
    {
      header: 'Date de fin',
      accessorKey: 'endDate',
      cell: ({ row }) => row.original?.endDate || 'N/A'
    },
    {
      header: 'Département',
      accessorKey: 'department',
      cell: ({ row }) => row.original?.department || 'Non spécifié'
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original?.status || 'Inconnu';
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
          data={safeContracts}
          isLoading={isLoading}
          emptyMessage="Aucun contrat disponible"
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesContracts;
