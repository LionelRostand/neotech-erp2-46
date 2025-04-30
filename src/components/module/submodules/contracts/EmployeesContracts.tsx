
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useContractsData } from '@/hooks/useContractsData';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import CreateContractDialog from './CreateContractDialog';

const EmployeesContracts = () => {
  const { contracts, stats, isLoading, error } = useContractsData();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
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

  // Gérer l'ajout d'un nouveau contrat
  const handleContractCreated = () => {
    // Refresh data or update UI accordingly
    console.log('Contract created, should refresh data');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des contrats</CardTitle>
              <Button onClick={() => setOpenCreateDialog(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Nouveau contrat
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-500">Une erreur est survenue lors du chargement des données.</div>
          </CardContent>
        </Card>

        <CreateContractDialog 
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
          onContractCreated={handleContractCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tableau de bord des contrats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total des contrats</p>
                <h3 className="text-3xl font-bold">{stats?.total || 0}</h3>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contrats actifs</p>
                <h3 className="text-3xl font-bold">{stats?.active || 0}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contrats à venir</p>
                <h3 className="text-3xl font-bold">{stats?.upcoming || 0}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contrats expirés</p>
                <h3 className="text-3xl font-bold">{stats?.expired || 0}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des contrats avec bouton d'ajout */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des contrats</CardTitle>
            <Button onClick={() => setOpenCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau contrat
            </Button>
          </div>
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

      <CreateContractDialog 
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onContractCreated={handleContractCreated}
      />
    </div>
  );
};

export default EmployeesContracts;
