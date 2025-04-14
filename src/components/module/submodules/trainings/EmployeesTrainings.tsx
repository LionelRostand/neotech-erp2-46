
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Filter, CalendarDays, Search, Award, FileText } from 'lucide-react';
import { useTrainingsData } from '@/hooks/useTrainingsData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ExportTrainingsDialog from './ExportTrainingsDialog';
import CreateTrainingDialog from './CreateTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import { Training } from '@/hooks/useTrainingsData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EmployeesTrainings = () => {
  const { trainings, stats, isLoading } = useTrainingsData();
  const { employees } = useHrModuleData();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  
  const [view, setView] = useState('tableau');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Filter trainings based on filters
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = !searchTerm || 
      (training.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (training.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (training.provider?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesEmployee = filterEmployee === 'all' || training.employeeId === filterEmployee;
    const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
    
    return matchesSearch && matchesEmployee && matchesStatus;
  });
  
  // Handle create training submission
  const handleCreateTraining = async (data: any) => {
    try {
      // The actual adding is done within the dialog component
      // Here we just refresh the data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error creating training:', error);
    }
  };
  
  // Handle training deletion
  const handleDeleteTraining = (training: Training) => {
    setSelectedTraining(training);
    setShowDeleteDialog(true);
  };
  
  // Handle confirmation of deletion
  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    setSelectedTraining(null);
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Formations</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.planned}</div>
              <p className="text-muted-foreground">Planifiées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-muted-foreground">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-muted-foreground">Terminées</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des formations</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Planifiée">Planifiées</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminée">Terminées</SelectItem>
                  <SelectItem value="Annulée">Annulées</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex flex-row gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setView('tableau')}
                  className={view === 'tableau' ? 'bg-muted' : ''}
                >
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Vue tableau</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setView('cartes')}
                  className={view === 'cartes' ? 'bg-muted' : ''}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="sr-only">Vue cartes</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Training list */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {filteredTrainings.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucune formation trouvée</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucune formation ne correspond à vos critères de recherche.
                  </p>
                </div>
              ) : (
                <>
                  {view === 'tableau' ? (
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-left">Titre</th>
                            <th className="py-3 px-4 text-left">Employé</th>
                            <th className="py-3 px-4 text-left">Type</th>
                            <th className="py-3 px-4 text-left">Dates</th>
                            <th className="py-3 px-4 text-left">Statut</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTrainings.map((training) => (
                            <tr key={training.id} className="border-b">
                              <td className="py-3 px-4 font-medium">{training.title}</td>
                              <td className="py-3 px-4">{training.employeeName}</td>
                              <td className="py-3 px-4">{training.type}</td>
                              <td className="py-3 px-4">
                                {training.startDate} {training.endDate ? `- ${training.endDate}` : ''}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={
                                  training.status === 'Terminée' ? 'success' : 
                                  training.status === 'En cours' ? 'default' :
                                  training.status === 'Planifiée' ? 'secondary' : 'destructive'
                                }>
                                  {training.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteTraining(training)}
                                  className="hover:text-destructive"
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTrainings.map((training) => (
                        <Card key={training.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-medium text-lg">{training.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {training.employeeName}
                                </p>
                              </div>
                              <Badge variant={
                                training.status === 'Terminée' ? 'success' : 
                                training.status === 'En cours' ? 'default' :
                                training.status === 'Planifiée' ? 'secondary' : 'destructive'
                              }>
                                {training.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {training.startDate} {training.endDate ? `- ${training.endDate}` : ''}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{training.type}</span>
                              </div>
                              
                              {training.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Filter className="h-4 w-4 text-muted-foreground" />
                                  <span>{training.location}</span>
                                </div>
                              )}
                            </div>
                            
                            {training.description && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {training.description}
                              </p>
                            )}
                            
                            <div className="flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteTraining(training)}
                                className="hover:text-destructive"
                              >
                                Supprimer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <CreateTrainingDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateTraining}
        employees={employees}
      />
      
      <ExportTrainingsDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        data={filteredTrainings}
      />
      
      <DeleteTrainingDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        training={selectedTraining}
      />
    </div>
  );
};

export default EmployeesTrainings;
