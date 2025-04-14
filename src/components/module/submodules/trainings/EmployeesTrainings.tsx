
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  GraduationCap, 
  Filter, 
  Search, 
  FileText,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import DataTable from '@/components/DataTable';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubmoduleHeader from '@/components/module/submodules/SubmoduleHeader';
import { employeesModule } from '@/data/modules/employees';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import TrainingsFilter from './TrainingsFilter';
import CreateTrainingDialog from './CreateTrainingDialog';

const EmployeesTrainings: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch trainings data
  const { trainings, stats, isLoading } = useTrainingsData(refreshTrigger);
  const { employees } = useHrModuleData();

  // Filter trainings based on search query, filters, and active tab
  const filteredTrainings = React.useMemo(() => {
    let filtered = [...trainings];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        training => 
          training.title.toLowerCase().includes(query) || 
          training.employeeName?.toLowerCase().includes(query) ||
          training.type.toLowerCase().includes(query) ||
          training.provider?.toLowerCase().includes(query)
      );
    }

    // Filter by tab
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'planned':
          filtered = filtered.filter(training => training.status === 'Planifiée');
          break;
        case 'inProgress':
          filtered = filtered.filter(training => training.status === 'En cours');
          break;
        case 'completed':
          filtered = filtered.filter(training => training.status === 'Terminée');
          break;
        case 'cancelled':
          filtered = filtered.filter(training => training.status === 'Annulée');
          break;
      }
    }

    // Apply additional filters
    if (filters && Object.keys(filters).length > 0) {
      if (filters.employee) {
        const employeeQuery = filters.employee.toLowerCase();
        filtered = filtered.filter(training => 
          training.employeeName?.toLowerCase().includes(employeeQuery)
        );
      }
      
      if (filters.title) {
        const titleQuery = filters.title.toLowerCase();
        filtered = filtered.filter(training => 
          training.title.toLowerCase().includes(titleQuery)
        );
      }
      
      if (filters.type && filters.type !== 'all_types') {
        filtered = filtered.filter(training => training.type === filters.type);
      }
      
      if (filters.department && filters.department !== 'all_departments') {
        filtered = filtered.filter(training => training.department === filters.department);
      }
      
      if (filters.status && filters.status !== 'all_statuses') {
        filtered = filtered.filter(training => training.status === filters.status);
      }
      
      if (filters.provider) {
        const providerQuery = filters.provider.toLowerCase();
        filtered = filtered.filter(training => 
          training.provider?.toLowerCase().includes(providerQuery)
        );
      }
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filtered = filtered.filter(training => {
          const trainingDate = new Date(training.startDate);
          return trainingDate >= fromDate;
        });
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filtered = filtered.filter(training => {
          const trainingDate = new Date(training.startDate);
          return trainingDate <= toDate;
        });
      }
      
      if (filters.certificate) {
        if (filters.certificate === 'yes') {
          filtered = filtered.filter(training => training.certificate === true);
        } else if (filters.certificate === 'no') {
          filtered = filtered.filter(training => training.certificate === false);
        }
      }
    }

    return filtered;
  }, [trainings, searchQuery, activeTab, filters]);

  // Column definitions for the DataTable
  const columns = [
    {
      header: 'Employé',
      accessorKey: 'employeeName',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original.employeePhoto && (
            <img 
              src={row.original.employeePhoto} 
              alt={row.original.employeeName} 
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <span>{row.original.employeeName}</span>
        </div>
      ),
    },
    {
      header: 'Formation',
      accessorKey: 'title',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        let color = '';
        
        switch (status) {
          case 'Planifiée':
            color = 'bg-blue-100 text-blue-800';
            break;
          case 'En cours':
            color = 'bg-yellow-100 text-yellow-800';
            break;
          case 'Terminée':
            color = 'bg-green-100 text-green-800';
            break;
          case 'Annulée':
            color = 'bg-red-100 text-red-800';
            break;
          default:
            color = 'bg-gray-100 text-gray-800';
        }
        
        return (
          <Badge className={color}>
            {status}
          </Badge>
        );
      },
    },
    {
      header: 'Date de début',
      accessorKey: 'startDate',
    },
    {
      header: 'Durée',
      accessorKey: 'duration',
      cell: ({ row }) => `${row.original.duration || 1} jour(s)`,
    },
    {
      header: 'Fournisseur',
      accessorKey: 'provider',
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewTraining(row.original)}
          >
            Voir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDeleteTraining(row.original)}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  // Find the trainings submodule from the employees module
  const trainingsSubmodule = employeesModule.submodules.find(
    (submodule) => submodule.id === 'employees-trainings'
  );

  // Handler functions
  const handleViewTraining = (training: Training) => {
    console.log('View training:', training);
    // TODO: Navigate to training details or open a dialog
  };

  const handleDeleteTraining = (training: Training) => {
    setSelectedTraining(training);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    // Refresh the data after deletion
    setRefreshTrigger(prev => prev + 1);
    setShowDeleteDialog(false);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleTrainingSubmit = () => {
    // Refresh the data after creating a new training
    setRefreshTrigger(prev => prev + 1);
    setShowCreateDialog(false);
  };

  return (
    <Card className="w-full">
      {trainingsSubmodule && (
        <SubmoduleHeader
          module={employeesModule}
          submodule={trainingsSubmodule}
        />
      )}
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Total</h3>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-blue-700">Planifiées</h3>
              <p className="text-3xl font-bold text-blue-700">{stats.planned}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-yellow-700">En cours</h3>
              <p className="text-3xl font-bold text-yellow-700">{stats.inProgress}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-green-700">Terminées</h3>
              <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-red-700">Annulées</h3>
              <p className="text-3xl font-bold text-red-700">{stats.cancelled}</p>
            </div>
          </div>

          {/* Tabs and filters */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="planned">Planifiées</TabsTrigger>
                  <TabsTrigger value="inProgress">En cours</TabsTrigger>
                  <TabsTrigger value="completed">Terminées</TabsTrigger>
                  <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une formation..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
                
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
                
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle formation
                </Button>
              </div>
            </div>
          </div>

          {/* Trainings table */}
          <DataTable
            columns={columns}
            data={filteredTrainings}
            isLoading={isLoading}
            emptyMessage="Aucune formation trouvée"
          />
        </div>
      </CardContent>

      {/* Delete training dialog */}
      <DeleteTrainingDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        training={selectedTraining}
      />

      {/* Filter dialog */}
      <TrainingsFilter
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        onApplyFilters={handleApplyFilters}
      />

      {/* Create training dialog */}
      <CreateTrainingDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleTrainingSubmit}
        employees={employees || []}
      />
    </Card>
  );
};

export default EmployeesTrainings;
