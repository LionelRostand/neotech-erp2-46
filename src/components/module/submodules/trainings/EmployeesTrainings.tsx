
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileSpreadsheet, GraduationCap } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatusBadge from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SubmoduleHeader from '@/components/module/submodules/SubmoduleHeader';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Progress } from '@/components/ui/progress';
import CreateTrainingDialog from './CreateTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import { employeesModule } from '@/data/modules/employees';
import { AppModule, SubModule } from '@/data/types/modules';

// Define the Column type that matches what DataTable expects
interface Column {
  key: string;
  header: string;
  accessorKey?: string;
  cell?: (props: { row: any }) => React.ReactNode;
}

const EmployeesTrainings: React.FC = () => {
  const { trainings, stats, isLoading } = useTrainingsData();
  const { employees } = useHrModuleData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Create a module object that conforms to AppModule for the SubmoduleHeader
  const module: AppModule = employeesModule;
  
  // Find the trainings submodule or create one that conforms to SubModule
  const submodule: SubModule = useMemo(() => {
    const trainingSubmodule = employeesModule.submodules?.find(
      sub => sub.id === 'employees-trainings'
    );
    
    return trainingSubmodule || {
      id: 'employees-trainings',
      name: 'Formations',
      href: '/modules/employees/trainings',
      icon: { name: 'GraduationCap' }
    };
  }, []);

  const refreshData = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleCreateTraining = () => {
    setOpenCreateDialog(true);
  };

  const handleTrainingCreated = () => {
    refreshData();
    setOpenCreateDialog(false);
  };

  const handleDeleteTraining = (training: Training) => {
    setSelectedTraining(training);
    setOpenDeleteDialog(true);
  };

  const handleTrainingDeleted = () => {
    refreshData();
    setOpenDeleteDialog(false);
    setSelectedTraining(null);
  };

  // Filter trainings based on search term
  const filteredTrainings = useMemo(() => {
    return trainings.filter(training => {
      const searchLower = searchTerm.toLowerCase();
      return (
        training.title.toLowerCase().includes(searchLower) ||
        training.employeeName?.toLowerCase().includes(searchLower) ||
        training.type.toLowerCase().includes(searchLower) ||
        training.provider?.toLowerCase().includes(searchLower) ||
        training.location?.toLowerCase().includes(searchLower)
      );
    });
  }, [trainings, searchTerm]);

  // Table columns definition
  const columns: Column[] = useMemo(() => [
    {
      key: 'title',
      header: 'Titre',
      accessorKey: 'title',
    },
    {
      key: 'employeeName',
      header: 'Employé',
      accessorKey: 'employeeName',
    },
    {
      key: 'type',
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.type}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: 'outline' | 'success' | 'warning' | 'danger' = 'outline';
        
        switch (status) {
          case 'Planifiée':
            variant = 'outline';
            break;
          case 'En cours':
            variant = 'warning';
            break;
          case 'Terminée':
            variant = 'success';
            break;
          case 'Annulée':
            variant = 'danger';
            break;
        }
        
        return <StatusBadge status={status} variant={variant} label={status} />;
      },
    },
    {
      key: 'startDate',
      header: 'Date de début',
      accessorKey: 'startDate',
    },
    {
      key: 'endDate',
      header: 'Date de fin',
      accessorKey: 'endDate',
      cell: ({ row }) => row.original.endDate || '-',
    },
    {
      key: 'provider',
      header: 'Organisme',
      accessorKey: 'provider',
      cell: ({ row }) => row.original.provider || '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info(`Édition de ${row.original.title} - Fonctionnalité à venir`)}
          >
            Éditer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteTraining(row.original)}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <SubmoduleHeader module={module} submodule={submodule} />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{stats.total}</h3>
              <p className="text-muted-foreground">Formations</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{stats.planned}</h3>
              <p className="text-muted-foreground">Planifiées</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
              <p className="text-muted-foreground">En cours</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{stats.completed}</h3>
              <p className="text-muted-foreground">Terminées</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une formation..." 
                className="w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => toast.info("Export - Fonctionnalité à venir")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button onClick={handleCreateTraining}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle formation
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-8 space-y-4">
              <Progress value={75} className="w-full" />
              <p className="text-center text-muted-foreground">Chargement des formations...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredTrainings}
              emptyMessage="Aucune formation trouvée"
            />
          )}
        </CardContent>
      </Card>
      
      <CreateTrainingDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={handleTrainingCreated}
        employees={employees}
      />
      
      <DeleteTrainingDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleTrainingDeleted}
        training={selectedTraining}
      />
    </div>
  );
};

export default EmployeesTrainings;
