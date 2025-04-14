
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileSpreadsheet, MoreHorizontal, Filter, Download, GraduationCap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { Badge } from '@/components/ui/badge';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import TrainingsFilter from './TrainingsFilter';
import CreateTrainingDialog from './CreateTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import DataTable from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import SubmoduleHeader from '../SubmoduleHeader';
import { Column } from '@/components/DataTable';

const EmployeesTrainings = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { trainings, stats, isLoading } = useTrainingsData(refreshTrigger);
  const { employees, departments } = useHrModuleData();
  const [viewMode, setViewMode] = useState<'all' | 'current' | 'planned' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  // Filter trainings based on viewMode and searchTerm
  const filteredTrainings = useCallback(() => {
    let filtered = [...trainings];

    // Filter by view mode
    if (viewMode === 'current') {
      filtered = filtered.filter(training => training.status === 'En cours');
    } else if (viewMode === 'planned') {
      filtered = filtered.filter(training => training.status === 'Planifiée');
    } else if (viewMode === 'completed') {
      filtered = filtered.filter(training => training.status === 'Terminée');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(training => 
        training.title.toLowerCase().includes(term) ||
        training.employeeName?.toLowerCase().includes(term) ||
        training.provider?.toLowerCase().includes(term)
      );
    }

    // Apply active filters
    if (Object.keys(activeFilters).length > 0) {
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (!value || value === 'all_types' || value === 'all_departments' || value === 'all_statuses' || value === 'all_certificates') {
          return;
        }

        if (key === 'type') {
          filtered = filtered.filter(training => training.type === value);
        } else if (key === 'department') {
          filtered = filtered.filter(training => training.department === value);
        } else if (key === 'status') {
          filtered = filtered.filter(training => training.status === value);
        } else if (key === 'certificate') {
          const hasCertificate = value === 'yes';
          filtered = filtered.filter(training => training.certificate === hasCertificate);
        } else if (key === 'dateFrom' && value) {
          filtered = filtered.filter(training => {
            const trainingDate = new Date(training.startDate);
            const fromDate = new Date(value as string);
            return trainingDate >= fromDate;
          });
        } else if (key === 'dateTo' && value) {
          filtered = filtered.filter(training => {
            const trainingDate = new Date(training.startDate);
            const toDate = new Date(value as string);
            return trainingDate <= toDate;
          });
        } else if (key === 'provider' && value) {
          filtered = filtered.filter(training => 
            training.provider?.toLowerCase().includes((value as string).toLowerCase())
          );
        } else if (key === 'employee' && value) {
          filtered = filtered.filter(training => 
            training.employeeName?.toLowerCase().includes((value as string).toLowerCase())
          );
        }
      });
    }

    return filtered;
  }, [trainings, viewMode, searchTerm, activeFilters]);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsDeleteOpen(true);
  };

  // Generate statistics cards
  const statsCards = [
    { title: 'Formations en cours', value: stats.inProgress, color: 'bg-blue-500' },
    { title: 'Formations planifiées', value: stats.planned, color: 'bg-yellow-500' },
    { title: 'Formations terminées', value: stats.completed, color: 'bg-green-500' },
    { title: 'Total', value: stats.total, color: 'bg-gray-500' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case 'En cours':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case 'Terminée':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'Annulée':
        return <Badge className="bg-gray-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const trainingColumns: Column[] = [
    { key: 'title', header: 'Formation' },
    { key: 'employeeName', header: 'Employé' },
    { key: 'type', header: 'Type' },
    { key: 'startDate', header: 'Date' },
    { 
      key: 'status', 
      header: 'Statut',
      cell: ({ row }) => getStatusBadge(row.original.status)
    },
    { 
      key: 'duration', 
      header: 'Durée',
      cell: ({ row }) => `${row.original.duration} jour(s)`
    },
    { 
      key: 'actions', 
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteTraining(row.original)}>
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <SubmoduleHeader
        title="Gestion des formations"
        module={{ name: "Employés" }}
        submodule={{ name: "Formations", id: "employees-trainings" }}
        icon={<GraduationCap className="h-5 w-5" />}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className={`${card.color} text-white rounded-t-lg py-2`}>
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold pt-2">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Rechercher une formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
          <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setViewMode(value as any)}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="current">En cours</TabsTrigger>
          <TabsTrigger value="planned">Planifiées</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <DataTable
            title="Liste des formations"
            data={filteredTrainings()}
            columns={trainingColumns}
          />
        </TabsContent>
        <TabsContent value="current" className="mt-6">
          <DataTable
            title="Formations en cours"
            data={filteredTrainings()}
            columns={trainingColumns}
          />
        </TabsContent>
        <TabsContent value="planned" className="mt-6">
          <DataTable
            title="Formations planifiées"
            data={filteredTrainings()}
            columns={trainingColumns}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <DataTable
            title="Formations terminées"
            data={filteredTrainings()}
            columns={trainingColumns}
          />
        </TabsContent>
      </Tabs>

      <TrainingsFilter 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen} 
        onApplyFilters={handleApplyFilters} 
      />

      <CreateTrainingDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleRefresh}
        employees={employees}
      />

      <DeleteTrainingDialog 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onConfirm={handleRefresh}
        training={selectedTraining}
      />
    </div>
  );
};

export default EmployeesTrainings;
