
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  GraduationCap, 
  Plus, 
  RefreshCw, 
  Search, 
  User 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

import SubmoduleHeader from '../SubmoduleHeader';
import StatusBadge from './StatusBadge';
import CreateTrainingDialog from './CreateTrainingDialog';

import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { DataTable } from '@/components/DataTable';
import { Column } from '@/types/table-types';

const EmployeesTrainings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tabValue, setTabValue] = useState('all');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { trainings, stats, isLoading } = useTrainingsData(refreshTrigger);
  const { employees } = useEmployeeData();
  
  // Filter trainings based on search term, status and type
  const filteredTrainings = React.useMemo(() => {
    if (!trainings) return [];
    
    return trainings.filter(training => {
      const matchesSearch = 
        searchTerm === '' ||
        training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = 
        statusFilter === 'all' || 
        training.status === statusFilter;
        
      const matchesType = 
        typeFilter === 'all' || 
        training.type === typeFilter;
        
      const matchesTab = 
        tabValue === 'all' || 
        (tabValue === 'current' && (training.status === 'En cours' || training.status === 'Planifiée')) || 
        (tabValue === 'completed' && training.status === 'Terminée') || 
        (tabValue === 'cancelled' && training.status === 'Annulée');
        
      return matchesSearch && matchesStatus && matchesType && matchesTab;
    });
  }, [trainings, searchTerm, statusFilter, typeFilter, tabValue]);
  
  const getTrainingStatusElement = (status: "Planifiée" | "En cours" | "Terminée" | "Annulée") => {
    return <StatusBadge status={status} />;
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };
  
  const handleTabChange = (value: string) => {
    setTabValue(value);
  };
  
  const handleCreateTraining = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleTrainingCreated = () => {
    // Refresh the trainings data when a new training is created
    setRefreshTrigger(prev => prev + 1);
    toast.success('Formation créée avec succès');
    setOpenCreateDialog(false);
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Simulated delay for refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Données actualisées avec succès');
    }, 800);
  };
  
  // Define the columns for the DataTable
  const columns: Column[] = [
    {
      key: 'title',
      header: 'Formation',
      cell: ({ row }) => {
        const training = row.original as Training;
        return training.title;
      },
      enableSorting: true,
    },
    {
      key: 'employee',
      header: 'Employé',
      cell: ({ row }) => {
        const training = row.original as Training;
        return training.employeeName || 'Non assigné';
      },
      enableSorting: true,
    },
    {
      key: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const training = row.original as Training;
        return training.type;
      },
      enableSorting: true,
    },
    {
      key: 'startDate',
      header: 'Date de début',
      cell: ({ row }) => {
        const training = row.original as Training;
        return training.startDate;
      },
      enableSorting: true,
    },
    {
      key: 'endDate',
      header: 'Date de fin',
      cell: ({ row }) => {
        const training = row.original as Training;
        return training.endDate || 'Non définie';
      },
      enableSorting: true,
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const training = row.original as Training;
        return getTrainingStatusElement(training.status);
      },
      enableSorting: true,
    },
  ];
  
  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'technical', label: 'Technique' },
    { value: 'management', label: 'Management' },
    { value: 'soft_skills', label: 'Soft Skills' },
    { value: 'certification', label: 'Certification' },
    { value: 'compliance', label: 'Conformité' },
    { value: 'other', label: 'Autre' },
  ];
  
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'Planifiée', label: 'Planifiée' },
    { value: 'En cours', label: 'En cours' },
    { value: 'Terminée', label: 'Terminée' },
    { value: 'Annulée', label: 'Annulée' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Formations</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreateTraining}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Planifiées</span>
                <span className="text-2xl font-bold">{stats?.planned || 0}</span>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">En cours</span>
                <span className="text-2xl font-bold">{stats?.inProgress || 0}</span>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Terminées</span>
                <span className="text-2xl font-bold">{stats?.completed || 0}</span>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Annulées</span>
                <span className="text-2xl font-bold">{stats?.cancelled || 0}</span>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" value={tabValue} onValueChange={handleTabChange}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-initial">
            <Award className="h-4 w-4 mr-2" />
            Toutes
          </TabsTrigger>
          <TabsTrigger value="current" className="flex-1 md:flex-initial">
            <Clock className="h-4 w-4 mr-2" />
            En cours
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-initial">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Terminées
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1 md:flex-initial">
            <AlertCircle className="h-4 w-4 mr-2" />
            Annulées
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={tabValue} className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Type de formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DataTable
                columns={columns}
                data={filteredTrainings}
                isLoading={isLoading}
                emptyMessage="Aucune formation trouvée"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CreateTrainingDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onClose={handleCloseDialog}
        onSubmit={handleTrainingCreated}
        employees={employees}
      />
    </div>
  );
};

export default EmployeesTrainings;
