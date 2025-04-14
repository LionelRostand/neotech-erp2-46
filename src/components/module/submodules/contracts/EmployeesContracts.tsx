
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContractsData, Contract } from '@/hooks/useContractsData';
import { PlusCircle, FileText, PenSquare } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreateContractDialog from './CreateContractDialog';
import ContractDetailsDialog from './ContractDetailsDialog';
import UpdateContractDialog from './UpdateContractDialog';

const EmployeesContracts = () => {
  const { contracts, isLoading, error } = useContractsData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Fonction pour ouvrir le dialogue de détails
  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsDialogOpen(true);
  };

  // Fonction pour ouvrir le dialogue de mise à jour
  const handleUpdateContract = (contract: Contract) => {
    setSelectedContract(contract);
    setUpdateDialogOpen(true);
  };

  // Fonction pour rafraîchir les données après une modification
  const handleContractUpdated = () => {
    // Les données sont automatiquement rafraîchies par useContractsData, mais on peut ajouter ici un refresh manuel si nécessaire
  };

  // Définition des colonnes pour la table
  const columns: ColumnDef<Contract>[] = [
    {
      accessorKey: 'employeeName',
      header: 'Employé',
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={contract.employeePhoto} alt={contract.employeeName} />
              <AvatarFallback>{contract.employeeName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{contract.employeeName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'position',
      header: 'Poste',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'startDate',
      header: 'Début',
    },
    {
      accessorKey: 'endDate',
      header: 'Fin',
      cell: ({ row }) => row.original.endDate || '—',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case 'Actif':
            return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
          case 'À venir':
            return <Badge className="bg-blue-500 hover:bg-blue-600">À venir</Badge>;
          case 'Expiré':
            return <Badge className="bg-red-500 hover:bg-red-600">Expiré</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleViewDetails(contract)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Détails
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleUpdateContract(contract)}
            >
              <PenSquare className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des contrats</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouveau contrat
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des contrats</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Chargement des contrats...</div>
          ) : error ? (
            <div className="text-red-500 p-4">Erreur: Impossible de charger les contrats</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={contracts} 
              searchColumn="employeeName"
              searchPlaceholder="Rechercher un employé..."
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogue pour créer un nouveau contrat */}
      <CreateContractDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onContractCreated={handleContractUpdated}
      />

      {/* Dialogue pour afficher les détails d'un contrat */}
      <ContractDetailsDialog 
        contract={selectedContract} 
        open={detailsDialogOpen} 
        onOpenChange={setDetailsDialogOpen}
      />

      {/* Dialogue pour mettre à jour un contrat */}
      <UpdateContractDialog 
        contract={selectedContract} 
        open={updateDialogOpen} 
        onOpenChange={setUpdateDialogOpen} 
        onContractUpdated={handleContractUpdated}
      />
    </div>
  );
};

export default EmployeesContracts;
