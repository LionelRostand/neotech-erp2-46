
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Filter, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import { toast } from 'sonner';
import { Contract } from './types';
import { Input } from '@/components/ui/input';
import CreateContractDialog from './CreateContractDialog';
import { useContractsData } from './hooks/useContractsData';
import { format } from 'date-fns';
import ContractDetailsDialog from './ContractDetailsDialog';
import UpdateContractDialog from './UpdateContractDialog';
import { fr } from 'date-fns/locale';
import StatusBadge from '@/components/StatusBadge';

const EmployeesContracts = () => {
  const { contracts, loading, refetchContracts, deleteContract } = useContractsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filteredContracts = contracts?.filter(contract => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contract.employeeName?.toLowerCase().includes(searchLower) ||
      contract.type?.toLowerCase().includes(searchLower) ||
      contract.reference?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleContractCreated = (contract: Contract) => {
    refetchContracts();
    toast.success('Contrat créé avec succès');
  };

  const handleContractUpdated = () => {
    refetchContracts();
    setIsUpdateDialogOpen(false);
    toast.success('Contrat mis à jour avec succès');
  };

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteContract = async (contract: Contract) => {
    if (!contract.id) {
      toast.error("Impossible de supprimer ce contrat");
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le contrat ${contract.reference} ?`)) {
      try {
        await deleteContract(contract.id);
        refetchContracts();
        toast.success('Contrat supprimé avec succès');
      } catch (error) {
        console.error("Erreur lors de la suppression du contrat:", error);
        toast.error('Erreur lors de la suppression du contrat');
      }
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Actif', status: 'success' };
      case 'expired':
        return { text: 'Expiré', status: 'danger' };
      case 'pending':
        return { text: 'En attente', status: 'warning' };
      case 'terminated':
        return { text: 'Résilié', status: 'danger' };
      default:
        return { text: status, status: 'danger' };
    }
  };

  const columns: Column[] = [
    { key: 'reference', header: 'Référence' },
    { key: 'employeeName', header: 'Employé' },
    { key: 'type', header: 'Type' },
    { 
      key: 'startDate', 
      header: 'Date début',
      cell: ({ row }) => {
        const date = row.original.startDate;
        return date ? format(new Date(date), 'dd MMM yyyy', { locale: fr }) : '-';
      }
    },
    { 
      key: 'endDate', 
      header: 'Date fin',
      cell: ({ row }) => {
        const date = row.original.endDate;
        return date ? format(new Date(date), 'dd MMM yyyy', { locale: fr }) : 'Indéterminé';
      }
    },
    { 
      key: 'status', 
      header: 'Statut',
      cell: ({ row }) => {
        const statusInfo = getStatusDisplay(row.original.status);
        return <StatusBadge status={statusInfo.status as any}>{statusInfo.text}</StatusBadge>;
      }
    },
    { 
      key: 'actions', 
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleViewDetails(row.original)}
          >
            Voir
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleUpdateContract(row.original)}
          >
            Modifier
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteContract(row.original)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des contrats</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contrat
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="w-80 relative">
              <Input
                placeholder="Rechercher un contrat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Filter className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>

          <DataTable
            title="Liste des contrats"
            data={filteredContracts}
            columns={columns}
          />
        </CardContent>
      </Card>

      <CreateContractDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onContractCreated={handleContractCreated}
      />

      {selectedContract && (
        <>
          <ContractDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            contract={selectedContract}
            onEdit={() => {
              setIsDetailsDialogOpen(false);
              setIsUpdateDialogOpen(true);
            }}
          />

          <UpdateContractDialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            contract={selectedContract}
            onContractUpdated={handleContractUpdated}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesContracts;
