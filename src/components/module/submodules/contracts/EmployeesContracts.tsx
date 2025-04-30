
import React, { useState, useCallback } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table-types';
import { useContractsData, Contract } from '@/hooks/useContractsData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import CreateContractDialog from './CreateContractDialog';
import UpdateContractDialog from './UpdateContractDialog';
import ViewContractDialog from './ViewContractDialog';
import DeleteContractDialog from './DeleteContractDialog';
import { toast } from 'sonner';

// Composant de statistiques des contrats
const ContractStats = ({ stats }: { stats: { active: number, upcoming: number, expired: number, total: number } }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Total des contrats</h3>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Contrats actifs</h3>
        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Contrats à venir</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Contrats expirés</h3>
        <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
      </div>
    </div>
  );
};

const EmployeesContracts = () => {
  const { contracts, stats, isLoading, error } = useContractsData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleRefreshData = useCallback(() => {
    // La mise à jour sera gérée automatiquement par useContractsData via Firebase
    toast.success("Les données ont été mises à jour");
  }, []);

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewDialogOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };

  const columns: Column<Contract>[] = [
    {
      header: "Employé",
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={contract.employeePhoto} alt={contract.employeeName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{contract.employeeName}</p>
              <p className="text-xs text-muted-foreground">{contract.position}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Type",
      accessorKey: "type"
    },
    {
      header: "Début",
      accessorKey: "startDate"
    },
    {
      header: "Fin",
      cell: ({ row }) => {
        const contract = row.original;
        return <span>{contract.endDate || "Indéterminé"}</span>;
      }
    },
    {
      header: "Statut",
      cell: ({ row }) => {
        const contract = row.original;
        let statusClass = "";
        
        switch(contract.status) {
          case "Actif":
            statusClass = "bg-green-100 text-green-800";
            break;
          case "À venir":
            statusClass = "bg-blue-100 text-blue-800";
            break;
          case "Expiré":
            statusClass = "bg-red-100 text-red-800";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800";
        }
        
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusClass}`}>
            {contract.status}
          </span>
        );
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleViewContract(contract)}
              title="Voir"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleEditContract(contract)}
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDeleteContract(contract)}
              title="Supprimer"
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des contrats</h1>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau contrat
        </Button>
      </div>
      
      {/* Statistiques */}
      <ContractStats stats={stats} />
      
      {/* Tableau des contrats */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Liste des contrats</h2>
        <DataTable
          columns={columns}
          data={contracts || []}
          isLoading={isLoading}
          emptyMessage="Aucun contrat trouvé"
        />
      </div>
      
      {/* Dialogues */}
      <CreateContractDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleRefreshData}
      />
      
      {selectedContract && (
        <>
          <ViewContractDialog 
            contract={selectedContract}
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
          />
          
          <UpdateContractDialog 
            contract={selectedContract}
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            onSuccess={handleRefreshData}
          />
          
          <DeleteContractDialog 
            contract={selectedContract}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onDeleteSuccess={handleRefreshData}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesContracts;
