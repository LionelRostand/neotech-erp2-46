
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Search, GraduationCap, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/DataTable'; // Fixed: Changed from named import to default import
import { Training, useTrainingsData } from '@/hooks/useTrainingsData';
import TrainingsFilter from './TrainingsFilter';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import CreateTrainingDialog from './CreateTrainingDialog';
import SubmoduleHeader from '@/components/module/submodules/SubmoduleHeader';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmployeesTrainings: React.FC = () => {
  const { toast } = useToast();
  const { trainings: allTrainings, stats } = useTrainingsData();
  const { employees } = useHrModuleData();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  // Filter and search trainings
  useEffect(() => {
    let filteredTrainings = [...allTrainings];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTrainings = filteredTrainings.filter(
        (training) =>
          training.title.toLowerCase().includes(query) ||
          training.employeeName?.toLowerCase().includes(query) ||
          training.provider?.toLowerCase().includes(query) ||
          training.type.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (Object.keys(activeFilters).length > 0) {
      if (activeFilters.employee) {
        filteredTrainings = filteredTrainings.filter((training) =>
          training.employeeName?.toLowerCase().includes(activeFilters.employee.toLowerCase())
        );
      }

      if (activeFilters.title) {
        filteredTrainings = filteredTrainings.filter((training) =>
          training.title.toLowerCase().includes(activeFilters.title.toLowerCase())
        );
      }

      if (activeFilters.type && activeFilters.type !== 'all_types') {
        filteredTrainings = filteredTrainings.filter(
          (training) => training.type === activeFilters.type
        );
      }

      if (activeFilters.department && activeFilters.department !== 'all_departments') {
        filteredTrainings = filteredTrainings.filter(
          (training) => training.department === activeFilters.department
        );
      }

      if (activeFilters.status && activeFilters.status !== 'all_statuses') {
        filteredTrainings = filteredTrainings.filter(
          (training) => training.status === activeFilters.status
        );
      }

      if (activeFilters.provider) {
        filteredTrainings = filteredTrainings.filter((training) =>
          training.provider?.toLowerCase().includes(activeFilters.provider.toLowerCase())
        );
      }

      if (activeFilters.certificate && activeFilters.certificate !== 'all_certificates') {
        const hasCertificate = activeFilters.certificate === 'yes';
        filteredTrainings = filteredTrainings.filter(
          (training) => !!training.certificate === hasCertificate
        );
      }

      if (activeFilters.dateFrom) {
        const dateFrom = new Date(activeFilters.dateFrom);
        filteredTrainings = filteredTrainings.filter((training) => {
          const trainingDate = new Date(training.startDate);
          return trainingDate >= dateFrom;
        });
      }

      if (activeFilters.dateTo) {
        const dateTo = new Date(activeFilters.dateTo);
        dateTo.setHours(23, 59, 59, 999); // Set to end of day
        filteredTrainings = filteredTrainings.filter((training) => {
          const trainingDate = new Date(training.startDate);
          return trainingDate <= dateTo;
        });
      }
    }

    setTrainings(filteredTrainings);
  }, [allTrainings, searchQuery, activeFilters]);

  const handleRowClick = (training: Training) => {
    // For future implementation: View training details
    toast({
      title: "Détails de la formation",
      description: `${training.title} - ${training.employeeName}`,
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setFilterDialogOpen(false);
  };

  const handleDeleteClick = (training: Training, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedTraining(training);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
    
    // Reset selected training
    setSelectedTraining(null);
  };

  const handleCreateTraining = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleTrainingSubmit = () => {
    setCreateDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
    toast({
      title: "Formation créée",
      description: "La formation a été créée avec succès",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terminée':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case 'En cours':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      case 'Planifiée':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
      case 'Annulée':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCertificateBadge = (hasCertificate: boolean) => {
    return hasCertificate ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Oui</Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">
        Non
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        description="Gérez les formations et développement professionnel des employés"
        icon={<GraduationCap className="h-6 w-6" />} 
      />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste des formations</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Input
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setFilterDialogOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filtres
                {Object.keys(activeFilters).length > 0 && (
                  <Badge className="ml-1 bg-primary text-white">
                    {Object.keys(activeFilters).length}
                  </Badge>
                )}
              </Button>
              
              <Button onClick={handleCreateTraining} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>

          <DataTable
            title="Formations"
            data={trainings}
            columns={[
              { key: 'employeeName', header: 'Employé' },
              { key: 'title', header: 'Formation' },
              { key: 'type', header: 'Type' },
              { 
                key: 'startDate', 
                header: 'Date de début',
              },
              { 
                key: 'status', 
                header: 'Statut',
                cell: ({ row }) => getStatusBadge(row.original.status)
              },
              { 
                key: 'certificate', 
                header: 'Certificat',
                cell: ({ row }) => getCertificateBadge(row.original.certificate)
              },
              {
                key: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={(e) => handleDeleteClick(row.original, e)}
                  >
                    Supprimer
                  </Button>
                )
              }
            ]}
            onRowClick={handleRowClick}
            className="shadow-none border border-gray-200"
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Total des formations</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">En cours</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Terminées</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Planifiées</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.planned}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Statistiques des formations</h3>
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Graphique des formations par statut</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TrainingsFilter
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
      />

      <DeleteTrainingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        training={selectedTraining}
      />

      <CreateTrainingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSubmit={handleTrainingSubmit}
        employees={employees || []}
      />
    </div>
  );
};

export default EmployeesTrainings;
