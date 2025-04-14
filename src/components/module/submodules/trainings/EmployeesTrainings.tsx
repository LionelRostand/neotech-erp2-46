
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Filter } from 'lucide-react';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import SubmoduleHeader from '../SubmoduleHeader';
import CreateTrainingDialog from './CreateTrainingDialog';
import StatusBadge from './StatusBadge';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Column } from '@/types/table-types';
import DataTable from '@/components/DataTable';

const EmployeesTrainings = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const { trainings, stats, isLoading } = useTrainingsData(refreshTrigger);
  const { employees } = useEmployeeData();
  
  // Filter trainings based on active tab and filters
  const filteredTrainings = useMemo(() => {
    if (!trainings) return [];
    
    let filtered = [...trainings];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      const statusMap: Record<string, string> = {
        'planned': 'Planifiée',
        'inProgress': 'En cours',
        'completed': 'Terminée',
        'cancelled': 'Annulée'
      };
      
      filtered = filtered.filter(training => training.status === statusMap[activeTab]);
    }
    
    // Apply text filter (on title or employee name)
    if (filterText) {
      const searchTerm = filterText.toLowerCase();
      filtered = filtered.filter(training => 
        training.title.toLowerCase().includes(searchTerm) || 
        (training.employeeName && training.employeeName.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(training => training.type === filterType);
    }
    
    return filtered;
  }, [trainings, activeTab, filterText, filterType]);
  
  // Handle closing the create dialog
  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
  };
  
  // Handle training created successfully
  const handleTrainingCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsCreateDialogOpen(false);
    toast.success('Formation créée avec succès');
  };
  
  // Create a status badge with appropriate variant
  const renderStatusBadge = (status: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée') => {
    return (
      <StatusBadge status={status} />
    );
  };
  
  // Format the training type for display
  const formatTrainingType = (type: string) => {
    const typeMap: Record<string, string> = {
      'technical': 'Technique',
      'management': 'Management',
      'soft_skills': 'Soft Skills',
      'certification': 'Certification',
      'compliance': 'Conformité',
      'other': 'Autre'
    };
    
    return typeMap[type] || type;
  };
  
  // Column definitions for the "All" tab
  const allColumns: Column[] = [
    { 
      key: 'title', 
      header: 'Formation',
      cell: (props) => props.row.original.title
    },
    { 
      key: 'employeeName', 
      header: 'Employé',
      cell: (props) => props.row.original.employeeName || 'Non assigné'
    },
    { 
      key: 'type', 
      header: 'Type',
      cell: (props) => formatTrainingType(props.row.original.type)
    },
    { 
      key: 'startDate', 
      header: 'Date de début',
      cell: (props) => props.row.original.startDate
    },
    { 
      key: 'status', 
      header: 'Statut',
      cell: (props) => renderStatusBadge(props.row.original.status)
    }
  ];
  
  // Column definitions for the "Planifiée" tab
  const plannedColumns: Column[] = [
    { 
      key: 'title', 
      header: 'Formation',
      cell: (props) => props.row.original.title
    },
    { 
      key: 'employeeName', 
      header: 'Employé',
      cell: (props) => props.row.original.employeeName || 'Non assigné'
    },
    { 
      key: 'type', 
      header: 'Type',
      cell: (props) => formatTrainingType(props.row.original.type)
    },
    { 
      key: 'startDate', 
      header: 'Date de début',
      cell: (props) => props.row.original.startDate
    },
    { 
      key: 'provider', 
      header: 'Prestataire',
      cell: (props) => props.row.original.provider || 'Non spécifié'
    }
  ];
  
  // Column definitions for the "En cours" tab
  const inProgressColumns: Column[] = [
    { 
      key: 'title', 
      header: 'Formation',
      cell: (props) => props.row.original.title
    },
    { 
      key: 'employeeName', 
      header: 'Employé',
      cell: (props) => props.row.original.employeeName || 'Non assigné'
    },
    { 
      key: 'startDate', 
      header: 'Date de début',
      cell: (props) => props.row.original.startDate
    },
    { 
      key: 'endDate', 
      header: 'Date de fin',
      cell: (props) => props.row.original.endDate || 'Non spécifiée'
    },
    { 
      key: 'provider', 
      header: 'Prestataire',
      cell: (props) => props.row.original.provider || 'Non spécifié'
    }
  ];
  
  // Column definitions for the "Terminée" tab
  const completedColumns: Column[] = [
    { 
      key: 'title', 
      header: 'Formation',
      cell: (props) => props.row.original.title
    },
    { 
      key: 'employeeName', 
      header: 'Employé',
      cell: (props) => props.row.original.employeeName || 'Non assigné'
    },
    { 
      key: 'type', 
      header: 'Type',
      cell: (props) => formatTrainingType(props.row.original.type)
    },
    { 
      key: 'endDate', 
      header: 'Date de fin',
      cell: (props) => props.row.original.endDate || 'Non spécifiée'
    },
    { 
      key: 'certificate', 
      header: 'Certification',
      cell: (props) => props.row.original.certificate ? 'Oui' : 'Non'
    }
  ];
  
  // Column definitions for the "Annulée" tab
  const cancelledColumns: Column[] = [
    { 
      key: 'title', 
      header: 'Formation',
      cell: (props) => props.row.original.title
    },
    { 
      key: 'employeeName', 
      header: 'Employé',
      cell: (props) => props.row.original.employeeName || 'Non assigné'
    },
    { 
      key: 'type', 
      header: 'Type',
      cell: (props) => formatTrainingType(props.row.original.type)
    },
    { 
      key: 'startDate', 
      header: 'Date planifiée',
      cell: (props) => props.row.original.startDate
    },
    { 
      key: 'provider', 
      header: 'Prestataire',
      cell: (props) => props.row.original.provider || 'Non spécifié'
    }
  ];
  
  // Determine which columns to use based on the active tab
  const getColumnsForTab = () => {
    switch(activeTab) {
      case 'planned':
        return plannedColumns;
      case 'inProgress':
        return inProgressColumns;
      case 'completed':
        return completedColumns;
      case 'cancelled':
        return cancelledColumns;
      default:
        return allColumns;
    }
  };
  
  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        title="Gestion des formations" 
        description="Gérez les formations des employés" 
      />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">formations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.planned}</div>
            <p className="text-sm text-muted-foreground">formations à venir</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inProgress}</div>
            <p className="text-sm text-muted-foreground">formations en cours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">formations complétées</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Rechercher une formation..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type de formation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="technical">Technique</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="soft_skills">Soft Skills</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="compliance">Conformité</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle formation
          </Button>
        </div>
      </div>
      
      {/* Trainings Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            Toutes 
            <Badge variant="outline" className="ml-2">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="planned">
            Planifiées
            <Badge variant="outline" className="ml-2">{stats.planned}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            En cours
            <Badge variant="outline" className="ml-2">{stats.inProgress}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminées
            <Badge variant="outline" className="ml-2">{stats.completed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées
            <Badge variant="outline" className="ml-2">{stats.cancelled}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              <DataTable
                title=""
                columns={getColumnsForTab()}
                data={filteredTrainings}
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Training Dialog */}
      <CreateTrainingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleTrainingCreated}
        employees={employees || []}
      />
    </div>
  );
};

export default EmployeesTrainings;
