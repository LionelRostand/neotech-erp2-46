
import React, { useState, useEffect, useMemo } from 'react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, FileDown, FileUp, User, Calendar, Book, GraduationCap } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SubmoduleHeader from '../SubmoduleHeader';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import TrainingsFilter from './TrainingsFilter';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import CreateTrainingDialog from './CreateTrainingDialog';
import { addTrainingDocument } from '@/hooks/firestore/firestore-utils';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planifiée': return 'bg-blue-500 hover:bg-blue-600';
    case 'En cours': return 'bg-green-500 hover:bg-green-600';
    case 'Terminée': return 'bg-gray-500 hover:bg-gray-600';
    case 'Annulée': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const EmployeesTrainings: React.FC = () => {
  const { trainings, isLoading, error } = useTrainingsData();
  const { employees } = useHrModuleData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter and search trainings
  const filteredTrainings = useMemo(() => {
    if (!trainings) return [];

    return trainings.filter(training => {
      // Text search
      const searchText = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        training.title.toLowerCase().includes(searchText) ||
        (training.employeeName && training.employeeName.toLowerCase().includes(searchText)) ||
        (training.description && training.description.toLowerCase().includes(searchText)) ||
        (training.provider && training.provider.toLowerCase().includes(searchText));

      if (!matchesSearch) return false;

      // Apply filters
      if (filters.employee && !training.employeeName?.toLowerCase().includes(filters.employee.toLowerCase())) {
        return false;
      }

      if (filters.title && !training.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      if (filters.type && filters.type !== 'all_types' && training.type !== filters.type) {
        return false;
      }

      if (filters.department && filters.department !== 'all_departments' && training.department !== filters.department) {
        return false;
      }

      if (filters.status && filters.status !== 'all_statuses' && training.status !== filters.status) {
        return false;
      }

      if (filters.provider && !training.provider?.toLowerCase().includes(filters.provider.toLowerCase())) {
        return false;
      }

      if (filters.certificate === 'yes' && !training.certificate) {
        return false;
      }

      if (filters.certificate === 'no' && training.certificate) {
        return false;
      }

      // Date filtering
      if (filters.dateFrom) {
        const startDate = new Date(training.startDate.split('/').reverse().join('-'));
        const filterFromDate = new Date(filters.dateFrom);
        if (startDate < filterFromDate) return false;
      }

      if (filters.dateTo) {
        const startDate = new Date(training.startDate.split('/').reverse().join('-'));
        const filterToDate = new Date(filters.dateTo);
        if (startDate > filterToDate) return false;
      }

      return true;
    });
  }, [trainings, searchTerm, filters]);

  // Prepare columns for the table
  const columns = useMemo<ColumnDef<Training>[]>(() => [
    {
      id: 'employee',
      header: 'Employé',
      cell: ({ row }) => {
        const training = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              {training.employeePhoto ? (
                <AvatarImage src={training.employeePhoto} alt={training.employeeName || ''} />
              ) : (
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
            <span>{training.employeeName}</span>
          </div>
        );
      },
      sortingFn: 'text',
    },
    {
      accessorKey: 'title',
      header: 'Formation',
      cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div>{row.original.type}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Date de début',
      cell: ({ row }) => <div>{row.original.startDate}</div>,
    },
    {
      accessorKey: 'endDate',
      header: 'Date de fin',
      cell: ({ row }) => <div>{row.original.endDate || '-'}</div>,
    },
    {
      accessorKey: 'duration',
      header: 'Durée (jours)',
      cell: ({ row }) => <div>{row.original.duration || '-'}</div>,
    },
    {
      accessorKey: 'provider',
      header: 'Fournisseur',
      cell: ({ row }) => <div>{row.original.provider || '-'}</div>,
    },
    {
      id: 'certificate',
      header: 'Certificat',
      cell: ({ row }) => (
        <div>
          {row.original.certificate ? (
            <Badge className="bg-green-500 hover:bg-green-600">Oui</Badge>
          ) : (
            <Badge variant="outline">Non</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setTrainingToDelete(row.original);
                setIsDeleteDialogOpen(true);
              }}
            >
              Supprimer
            </Button>
          </div>
        );
      },
    },
  ], []);

  // Handle create training submission
  const handleTrainingSubmit = async (trainingData: any) => {
    try {
      await addTrainingDocument(trainingData);
      toast.success('Formation ajoutée avec succès');
      setRefreshTrigger(prev => prev + 1);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation:', error);
      toast.error('Erreur lors de l\'ajout de la formation');
    }
  };

  // Handle confirmation of training deletion
  const handleDeleteConfirm = () => {
    // This will close the dialog and refresh the trainings list
    setRefreshTrigger(prev => prev + 1);
    setIsDeleteDialogOpen(false);
    setTrainingToDelete(null);
  };

  // Display loading state and errors
  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des formations...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Erreur: Impossible de charger les formations</div>;
  }

  // Training statistics by status
  const plannedCount = trainings.filter(t => t.status === 'Planifiée').length;
  const inProgressCount = trainings.filter(t => t.status === 'En cours').length;
  const completedCount = trainings.filter(t => t.status === 'Terminée').length;
  const cancelledCount = trainings.filter(t => t.status === 'Annulée').length;

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        title="Formations" 
        description="Gestion des formations pour les employés"
        icon={<GraduationCap className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formations Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plannedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formations En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formations Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formations Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Input
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                icon={<Search className="h-4 w-4" />}
              />
              <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Button variant="secondary">
                <FileDown className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="secondary">
                <FileUp className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle Formation
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredTrainings}
            pageSize={10}
            searchKey="title"
          />
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des formations</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64 border rounded">
                <div className="text-center">
                  <Calendar className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2">La vue calendrier sera disponible prochainement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TrainingsFilter
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilters={setFilters}
      />

      <DeleteTrainingDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        training={trainingToDelete}
      />

      <CreateTrainingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleTrainingSubmit}
        employees={employees as Employee[]}
      />
    </div>
  );
};

export default EmployeesTrainings;
