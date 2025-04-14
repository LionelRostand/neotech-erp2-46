
import React, { useState, useEffect, useMemo } from 'react';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  FileText, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Briefcase, 
  Award
} from 'lucide-react';
import { addTrainingDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import CreateTrainingDialog from './CreateTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import TrainingsFilter from './TrainingsFilter';
import ExportTrainingsDialog from './ExportTrainingsDialog';

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planifiée':
      return 'bg-blue-500';
    case 'En cours':
      return 'bg-yellow-500';
    case 'Terminée':
      return 'bg-green-500';
    case 'Annulée':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const EmployeesTrainings: React.FC = () => {
  const { trainings, stats, isLoading } = useTrainingsData();
  const { employees } = useEmployeeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [filters, setFilters] = useState<any>({});

  // Filter and search trainings
  const filteredTrainings = useMemo(() => {
    if (!trainings) return [];
    
    let filtered = [...trainings];
    
    // Apply search filter
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
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(training => {
        if (activeTab === 'planned') return training.status === 'Planifiée';
        if (activeTab === 'inProgress') return training.status === 'En cours';
        if (activeTab === 'completed') return training.status === 'Terminée';
        if (activeTab === 'cancelled') return training.status === 'Annulée';
        return true;
      });
    }
    
    // Apply advanced filters
    if (filters.employee) {
      filtered = filtered.filter(training => 
        training.employeeName?.toLowerCase().includes(filters.employee.toLowerCase())
      );
    }
    
    if (filters.title) {
      filtered = filtered.filter(training => 
        training.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.type && filters.type !== 'all_types') {
      filtered = filtered.filter(training => training.type === filters.type);
    }
    
    if (filters.department && filters.department !== 'all_departments') {
      filtered = filtered.filter(training => training.department === filters.department);
    }
    
    if (filters.status && filters.status !== 'all_statuses') {
      const statusMapping: Record<string, string> = {
        completed: 'Terminée',
        in_progress: 'En cours',
        scheduled: 'Planifiée',
        cancelled: 'Annulée'
      };
      filtered = filtered.filter(training => training.status === statusMapping[filters.status]);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(training => {
        const trainingDate = new Date(training.startDate.split('/').reverse().join('-'));
        return trainingDate >= fromDate;
      });
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(training => {
        const trainingDate = new Date(training.startDate.split('/').reverse().join('-'));
        return trainingDate <= toDate;
      });
    }
    
    if (filters.provider) {
      filtered = filtered.filter(training => 
        training.provider?.toLowerCase().includes(filters.provider.toLowerCase())
      );
    }
    
    if (filters.certificate && filters.certificate !== 'all_certificates') {
      const hasCertificate = filters.certificate === 'yes';
      filtered = filtered.filter(training => Boolean(training.certificate) === hasCertificate);
    }
    
    return filtered;
  }, [trainings, searchQuery, activeTab, filters]);

  const handleCreateTraining = async (training: any) => {
    try {
      await addTrainingDocument(training);
      toast.success('Formation ajoutée avec succès');
      // Trigger a refresh of the trainings data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation:', error);
      toast.error('Erreur lors de l\'ajout de la formation');
    }
  };

  const handleDeleteClick = (training: Training) => {
    setSelectedTraining(training);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleApplyFilters = (filters: any) => {
    setFilters(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des formations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="planned">Planifiées</TabsTrigger>
          <TabsTrigger value="inProgress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredTrainings.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-background">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Aucune formation trouvée</h3>
              <p className="mt-2 text-sm text-muted-foreground mb-6">
                Aucune formation ne correspond à votre recherche ou à vos filtres.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une formation
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrainings.map((training) => (
                <Card key={training.id} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-start">
                      <Badge className={`${getStatusColor(training.status)} hover:${getStatusColor(training.status)}`}>
                        {training.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(training)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="mt-2 line-clamp-1">{training.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{training.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={training.employeePhoto} alt={training.employeeName} />
                          <AvatarFallback>{training.employeeName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{training.employeeName}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>Du {training.startDate}{training.endDate ? ` au ${training.endDate}` : ''}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="mr-1 h-4 w-4" />
                        <span>{training.type}</span>
                      </div>
                      {training.provider && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{training.provider}</span>
                        </div>
                      )}
                      {training.certificate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Award className="mr-1 h-4 w-4" />
                          <span>Certification disponible</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <CreateTrainingDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateTraining}
        employees={employees || []}
      />
      
      <DeleteTrainingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        training={selectedTraining}
      />
      
      <TrainingsFilter
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
      />
      
      <ExportTrainingsDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        data={filteredTrainings}
      />
    </div>
  );
};

export default EmployeesTrainings;
