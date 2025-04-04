
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  ListFilter, 
  Plus,
  Download,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useTrainingsData } from '@/hooks/useTrainingsData';
import CreateTrainingDialog from './trainings/CreateTrainingDialog';
import TrainingsFilter from './trainings/TrainingsFilter';
import ExportTrainingsDialog from './trainings/ExportTrainingsDialog';

const EmployeesTrainings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('formations');
  const { trainings, stats, isLoading, error } = useTrainingsData();
  const [filteredTrainings, setFilteredTrainings] = useState(trainings);
  const [filters, setFilters] = useState({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  React.useEffect(() => {
    setFilteredTrainings(trainings);
  }, [trainings]);

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    
    // Appliquer les filtres sur les données
    if (Object.keys(newFilters).length === 0) {
      setFilteredTrainings(trainings);
      return;
    }
    
    const filtered = trainings.filter(training => {
      let pass = true;
      
      if (newFilters.employee && training.employeeName) {
        pass = pass && training.employeeName.toLowerCase().includes(newFilters.employee.toLowerCase());
      }
      
      if (newFilters.title && training.title) {
        pass = pass && training.title.toLowerCase().includes(newFilters.title.toLowerCase());
      }
      
      if (newFilters.type && newFilters.type !== 'all' && training.type) {
        pass = pass && training.type === newFilters.type;
      }
      
      if (newFilters.department && newFilters.department !== 'all' && training.department) {
        pass = pass && training.department === newFilters.department;
      }
      
      if (newFilters.status && newFilters.status !== 'all') {
        pass = pass && training.status === newFilters.status;
      }
      
      if (newFilters.provider && training.provider) {
        pass = pass && training.provider.toLowerCase().includes(newFilters.provider.toLowerCase());
      }
      
      if (newFilters.dateFrom) {
        const trainingDate = new Date(training.startDate.split('/').reverse().join('-'));
        const fromDate = new Date(newFilters.dateFrom);
        pass = pass && trainingDate >= fromDate;
      }
      
      if (newFilters.dateTo) {
        const trainingDate = new Date(training.startDate.split('/').reverse().join('-'));
        const toDate = new Date(newFilters.dateTo);
        pass = pass && trainingDate <= toDate;
      }
      
      if (newFilters.certificate && newFilters.certificate !== 'all') {
        const certValue = newFilters.certificate === 'true';
        pass = pass && training.certificate === certValue;
      }
      
      return pass;
    });
    
    setFilteredTrainings(filtered);
  };

  const handleExportData = () => {
    setShowExportDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des formations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des formations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des formations</h2>
          <p className="text-gray-500">Planification et suivi des formations professionnelles</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilterDialog(true)}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Planifiées</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.planned}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">En cours</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.inProgress}</p>
            </div>
            <BookOpen className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Terminées</h3>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Annulées</h3>
              <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-3">
          <TabsTrigger value="formations" className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Formations
          </TabsTrigger>
          <TabsTrigger value="catalogue" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Catalogue
          </TabsTrigger>
          <TabsTrigger value="fournisseurs" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Fournisseurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formations">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employé</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Date début</TableHead>
                      <TableHead>Date fin</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainings.length > 0 ? (
                      filteredTrainings.map((training) => (
                        <TableRow key={training.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={training.employeePhoto} alt={training.employeeName} />
                                <AvatarFallback>{training.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{training.employeeName}</p>
                                <p className="text-xs text-gray-500">{training.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{training.title}</p>
                              <p className="text-xs text-gray-500">{training.type}</p>
                            </div>
                          </TableCell>
                          <TableCell>{training.startDate}</TableCell>
                          <TableCell>{training.endDate || '-'}</TableCell>
                          <TableCell>{training.duration} jour(s)</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                training.status === 'Terminée'
                                  ? 'bg-green-100 text-green-800'
                                  : training.status === 'En cours'
                                  ? 'bg-amber-100 text-amber-800'
                                  : training.status === 'Annulée'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {training.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucune formation trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalogue">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Catalogue des formations disponibles (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fournisseurs">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Liste des fournisseurs de formation (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Modals */}
      <CreateTrainingDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      
      <TrainingsFilter
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        onApplyFilters={applyFilters}
      />
      
      <ExportTrainingsDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        data={filteredTrainings}
      />
    </div>
  );
};

export default EmployeesTrainings;
