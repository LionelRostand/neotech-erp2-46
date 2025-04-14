
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContractsData, Contract } from '@/hooks/useContractsData';
import { PlusCircle, FileText, PenSquare, Users, Calendar, Briefcase, FileSignature } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreateContractDialog from './CreateContractDialog';
import ContractDetailsDialog from './ContractDetailsDialog';
import UpdateContractDialog from './UpdateContractDialog';
import StatCard from '@/components/StatCard';
import { PieChart } from '@/components/ui/charts';

const EmployeesContracts = () => {
  const { contracts, stats, isLoading, error } = useContractsData();
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
    // Les données sont automatiquement rafraîchies par useContractsData
  };

  // Préparer les données pour le graphique circulaire
  const chartData = {
    labels: ['Actifs', 'À venir', 'Expirés'],
    datasets: [
      {
        data: [stats.active, stats.upcoming, stats.expired],
        backgroundColor: ['#16a34a', '#2563eb', '#dc2626'],
        borderColor: ['#15803d', '#1d4ed8', '#b91c1c'],
        borderWidth: 1,
      },
    ],
  };

  // Définition des colonnes pour la table
  const columns = [
    {
      key: 'employeeName',
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
      key: 'position',
      header: 'Poste',
    },
    {
      key: 'type',
      header: 'Type',
    },
    {
      key: 'startDate',
      header: 'Début',
    },
    {
      key: 'endDate',
      header: 'Fin',
      cell: ({ row }) => row.original.endDate || '—',
    },
    {
      key: 'status',
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
      key: 'actions',
      header: 'Actions',
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
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des contrats</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouveau contrat
        </Button>
      </div>

      {/* Dashboard section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total des contrats" 
          value={`${stats.total}`} 
          icon={<FileSignature className="h-5 w-5 text-purple-600" />}
          description="Nombre total de contrats" 
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <StatCard 
          title="Contrats actifs" 
          value={`${stats.active}`} 
          icon={<Users className="h-5 w-5 text-green-600" />}
          description="Employés actuellement sous contrat" 
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <StatCard 
          title="Contrats à venir" 
          value={`${stats.upcoming}`} 
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          description="Nouveaux contrats en attente de démarrage" 
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <StatCard 
          title="Contrats expirés" 
          value={`${stats.expired}`} 
          icon={<Briefcase className="h-5 w-5 text-red-600" />}
          description="Contrats arrivés à échéance" 
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        />
      </div>

      {/* Chart section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des contrats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {/* Placeholder for line chart - would implement with actual data in a real scenario */}
              <div className="h-full w-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Graphique d'évolution des contrats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition des contrats</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <PieChart
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
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
              title="Liste des contrats"
              columns={columns} 
              data={contracts} 
              onRowClick={(contract) => handleViewDetails(contract as Contract)}
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
