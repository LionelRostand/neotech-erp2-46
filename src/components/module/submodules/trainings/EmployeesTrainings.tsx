
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, ChevronDown, Download } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import DataTable from '@/components/DataTable';
import StatusBadge from './StatusBadge';
import CreateTrainingDialog from './CreateTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import { Employee } from '@/types/employee';
import SubmoduleHeader from '../SubmoduleHeader';
import { modules } from '@/data/modules';
import { SubModule } from '@/data/types/modules';

const EmployeesTrainings: React.FC = () => {
  const { trainings, stats, isLoading } = useTrainingsData();
  const { employees } = useHrModuleData();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Find module and submodule
  const employeesModule = modules.find(m => m.id === 1);
  const trainingsSubmodule = employeesModule?.submodules.find(sm => sm.id === 'employees-trainings') as SubModule;

  // Filter trainings based on search query and tab
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = 
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'planned') return matchesSearch && training.status === 'Planifiée';
    if (activeTab === 'inProgress') return matchesSearch && training.status === 'En cours';
    if (activeTab === 'completed') return matchesSearch && training.status === 'Terminée';
    if (activeTab === 'cancelled') return matchesSearch && training.status === 'Annulée';
    
    return matchesSearch;
  });

  // Refresh trainings when needed
  const refreshTrainings = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle training creation
  const handleCreateTraining = () => {
    setOpenCreate(true);
  };

  // Handle training submission
  const handleTrainingSubmitted = () => {
    setOpenCreate(false);
    refreshTrainings();
  };

  // Handle training deletion
  const handleDeleteTraining = (training: Training) => {
    setSelectedTraining(training);
    setOpenDelete(true);
  };

  // Handle training deletion confirmation
  const handleDeleteConfirmed = () => {
    setOpenDelete(false);
    setSelectedTraining(null);
    refreshTrainings();
  };

  // Define table columns
  const columns = [
    {
      key: 'title',
      header: 'Titre',
      cell: (row: { original: Training }) => row.original.title
    },
    {
      key: 'employeeName',
      header: 'Employé',
      cell: (row: { original: Training }) => row.original.employeeName || 'Non assigné'
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row: { original: Training }) => row.original.type
    },
    {
      key: 'department',
      header: 'Département',
      cell: (row: { original: Training }) => row.original.department || 'Non spécifié'
    },
    {
      key: 'startDate',
      header: 'Date de début',
      cell: (row: { original: Training }) => row.original.startDate
    },
    {
      key: 'endDate',
      header: 'Date de fin',
      cell: (row: { original: Training }) => row.original.endDate || 'N/A'
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row: { original: Training }) => (
        <StatusBadge status={row.original.status}>
          {row.original.status}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row: { original: Training }) => (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => handleDeleteTraining(row.original)}
        >
          Supprimer
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {employeesModule && trainingsSubmodule && (
        <SubmoduleHeader module={employeesModule} submodule={trainingsSubmodule} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Total</h3>
          <span className="text-3xl font-bold">{stats.total}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Planifiées</h3>
          <span className="text-3xl font-bold text-blue-500">{stats.planned}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">En cours</h3>
          <span className="text-3xl font-bold text-yellow-500">{stats.inProgress}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Terminées</h3>
          <span className="text-3xl font-bold text-green-500">{stats.completed}</span>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une formation..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm" className="ml-2 whitespace-nowrap" onClick={handleCreateTraining}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle formation
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
              <TabsTrigger value="planned">Planifiées ({stats.planned})</TabsTrigger>
              <TabsTrigger value="inProgress">En cours ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Terminées ({stats.completed})</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées ({stats.cancelled})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="pt-2">
              <DataTable 
                columns={columns}
                data={filteredTrainings}
                isLoading={isLoading}
                emptyMessage="Aucune formation trouvée"
              />
            </TabsContent>
            
            <TabsContent value="planned" className="pt-2">
              <DataTable 
                columns={columns}
                data={filteredTrainings}
                isLoading={isLoading}
                emptyMessage="Aucune formation planifiée trouvée"
              />
            </TabsContent>
            
            <TabsContent value="inProgress" className="pt-2">
              <DataTable 
                columns={columns}
                data={filteredTrainings}
                isLoading={isLoading}
                emptyMessage="Aucune formation en cours trouvée"
              />
            </TabsContent>
            
            <TabsContent value="completed" className="pt-2">
              <DataTable 
                columns={columns}
                data={filteredTrainings}
                isLoading={isLoading}
                emptyMessage="Aucune formation terminée trouvée"
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="pt-2">
              <DataTable 
                columns={columns}
                data={filteredTrainings}
                isLoading={isLoading}
                emptyMessage="Aucune formation annulée trouvée"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateTrainingDialog 
        open={openCreate}
        onOpenChange={setOpenCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleTrainingSubmitted}
        employees={employees as Employee[]}
      />
      
      <DeleteTrainingDialog 
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDeleteConfirmed}
        training={selectedTraining}
      />
    </div>
  );
};

export default EmployeesTrainings;
