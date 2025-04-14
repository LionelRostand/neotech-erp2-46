
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Search, 
  FileDown, 
  FileUp,
  GraduationCap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import StatusBadge from '../StatusBadge';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table-types';
import SubmoduleHeader from '../SubmoduleHeader';
import { employeesModule } from '@/data/modules/employees';
import CreateTrainingDialog from './CreateTrainingDialog';

const EmployeesTrainings = () => {
  const { trainings, stats, isLoading } = useTrainingsData();
  const { employees } = useHrModuleData();
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (trainings) {
      let filtered = [...trainings];
      
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(training => 
          training.title.toLowerCase().includes(term) ||
          training.employeeName?.toLowerCase().includes(term) ||
          training.provider?.toLowerCase().includes(term)
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(training => training.status === statusFilter);
      }
      
      // Apply type filter
      if (typeFilter !== 'all') {
        filtered = filtered.filter(training => training.type === typeFilter);
      }
      
      setFilteredTrainings(filtered);
    }
  }, [trainings, searchTerm, statusFilter, typeFilter, refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
  };
  
  const handleExportTrainings = () => {
    // Export trainings to CSV or Excel
    console.log('Exporting trainings...');
  };
  
  const handleImportTrainings = () => {
    // Import trainings from CSV or Excel
    console.log('Importing trainings...');
  };
  
  const handleAddTraining = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
  };
  
  const handleTrainingCreated = () => {
    setIsCreateDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Column definition for the trainings table
  const statusCell = (props: { row: { original: Training } }) => {
    const { row } = props;
    return (
      <StatusBadge status={row.original.status}>
        {row.original.status}
      </StatusBadge>
    );
  };

  const columns: Column[] = [
    {
      key: 'title',
      header: 'Formation',
      cell: (props: { row: { original: any } }) => props.row.original.title
    },
    {
      key: 'employeeName',
      header: 'Employé',
      cell: (props: { row: { original: any } }) => props.row.original.employeeName
    },
    {
      key: 'type',
      header: 'Type',
      cell: (props: { row: { original: any } }) => props.row.original.type
    },
    {
      key: 'provider',
      header: 'Prestataire',
      cell: (props: { row: { original: any } }) => props.row.original.provider || 'N/A'
    },
    {
      key: 'startDate',
      header: 'Date de début',
      cell: (props: { row: { original: any } }) => props.row.original.startDate
    },
    {
      key: 'status',
      header: 'Statut',
      cell: statusCell
    }
  ];

  const module = employeesModule;
  const submodule = module.submodules.find(sm => sm.id === 'employees-trainings');

  return (
    <div className="space-y-6">
      {submodule && <SubmoduleHeader module={module} submodule={submodule} />}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="font-semibold text-xl">{stats.total}</h3>
            <p className="text-gray-500">Total des formations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-100">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="font-semibold text-xl">{stats.planned}</h3>
            <p className="text-gray-500">Formations planifiées</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="font-semibold text-xl">{stats.inProgress}</h3>
            <p className="text-gray-500">Formations en cours</p>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50 border-indigo-100">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="font-semibold text-xl">{stats.completed}</h3>
            <p className="text-gray-500">Formations terminées</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher une formation..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Planifiée">Planifiée</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminée">Terminée</SelectItem>
              <SelectItem value="Annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="technical">Technique</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="soft_skills">Soft Skills</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="compliance">Conformité</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTrainings}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={handleImportTrainings}>
            <FileUp className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={handleAddTraining}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredTrainings}
        isLoading={isLoading}
        emptyMessage="Aucune formation trouvée"
      />
      
      <CreateTrainingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleTrainingCreated}
        employees={employees}
      />
    </div>
  );
};

export default EmployeesTrainings;
