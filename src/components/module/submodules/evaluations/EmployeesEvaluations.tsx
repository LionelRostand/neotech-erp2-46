
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FilePenLine, FileSpreadsheet, Download, Filter } from 'lucide-react';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import EvaluationsFilter from './EvaluationsFilter';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';

const EmployeesEvaluations = () => {
  const { evaluations, isLoading, refreshData } = useEvaluationsData();
  const { employees } = useHrModuleData();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  const [view, setView] = useState('tableau');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format display dates safely
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Check if it's a valid date string first
      if (!dateString || dateString === '') {
        return '';
      }
      
      const date = new Date(dateString);
      if (!isValid(date)) {
        throw new Error('Invalid date value');
      }
      
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return dateString || '';
    }
  };
  
  // Filter evaluations based on filter criteria
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesEmployee = filterEmployee === 'all' || evaluation.employeeId === filterEmployee;
    const matchesStatus = filterStatus === 'all' || evaluation.status === filterStatus;
    const matchesSearch = !searchTerm || 
      (evaluation.employeeName && evaluation.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (evaluation.title && evaluation.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (evaluation.evaluatorName && evaluation.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesEmployee && matchesStatus && matchesSearch;
  });
  
  // Calculate stats
  const plannedCount = evaluations.filter(eval => eval.status === 'Planifiée').length;
  const completedCount = evaluations.filter(eval => eval.status === 'Complétée').length;
  const cancelledCount = evaluations.filter(eval => eval.status === 'Annulée').length;
  
  // Handle create evaluation submission
  const handleCreateEvaluation = async (data) => {
    try {
      console.log('Creating evaluation with data:', data);
      
      // Convert date to ISO string if it's a Date object
      const formattedData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
        createdAt: new Date().toISOString(),
      };
      
      await addDocument(COLLECTIONS.HR.EVALUATIONS, formattedData);
      toast.success('Évaluation créée avec succès');
      
      // Close dialog and refresh data
      setShowCreateDialog(false);
      refreshData();
    } catch (error) {
      console.error('Error creating evaluation:', error);
      toast.error('Erreur lors de la création de l\'évaluation');
    }
  };
  
  // Handle delete evaluation
  const handleDeleteEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowDeleteDialog(true);
  };
  
  // Handle confirmation of delete
  const handleConfirmDelete = async () => {
    try {
      // After deletion is confirmed
      setShowDeleteDialog(false);
      setSelectedEvaluation(null);
      refreshData();
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      toast.error('Erreur lors de la suppression de l\'évaluation');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Évaluations des employés</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{plannedCount}</div>
              <p className="text-muted-foreground">Planifiées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-muted-foreground">Complétées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{cancelledCount}</div>
              <p className="text-muted-foreground">Annulées</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter and search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Évaluations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une évaluation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
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
                  <SelectItem value="Complétée">Complétées</SelectItem>
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
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="sr-only">Vue tableau</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setView('fiches')}
                  className={view === 'fiches' ? 'bg-muted' : ''}
                >
                  <FilePenLine className="h-4 w-4" />
                  <span className="sr-only">Vue fiches</span>
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {filteredEvaluations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune évaluation ne correspond à vos critères.</p>
                </div>
              ) : (
                <>
                  {view === 'tableau' ? (
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-left">Employé</th>
                            <th className="py-3 px-4 text-left">Titre</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Évaluateur</th>
                            <th className="py-3 px-4 text-left">Statut</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEvaluations.map((evaluation) => (
                            <tr key={evaluation.id} className="border-b">
                              <td className="py-3 px-4">{evaluation.employeeName}</td>
                              <td className="py-3 px-4">{evaluation.title || 'Évaluation'}</td>
                              <td className="py-3 px-4">{formatDisplayDate(evaluation.date)}</td>
                              <td className="py-3 px-4">{evaluation.evaluatorName}</td>
                              <td className="py-3 px-4">
                                <Badge variant={
                                  evaluation.status === 'Complétée' ? 'success' : 
                                  evaluation.status === 'Planifiée' ? 'default' : 'destructive'
                                }>
                                  {evaluation.status || 'Planifiée'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteEvaluation(evaluation)}
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
                      {filteredEvaluations.map((evaluation) => (
                        <Card key={evaluation.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium mb-1">{evaluation.title || 'Évaluation'}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {formatDisplayDate(evaluation.date)}
                                </p>
                              </div>
                              <Badge variant={
                                evaluation.status === 'Complétée' ? 'success' : 
                                evaluation.status === 'Planifiée' ? 'default' : 'destructive'
                              }>
                                {evaluation.status || 'Planifiée'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">Employé:</span>
                                <span className="text-sm">{evaluation.employeeName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">Évaluateur:</span>
                                <span className="text-sm">{evaluation.evaluatorName}</span>
                              </div>
                              
                              {evaluation.comments && (
                                <div className="mt-4">
                                  <span className="font-medium text-sm">Commentaires:</span>
                                  <p className="text-sm mt-1">{evaluation.comments}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteEvaluation(evaluation)}
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
      
      {/* Create Dialog */}
      <CreateEvaluationDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateEvaluation}
        employees={employees}
      />
      
      {/* Export Dialog */}
      <ExportEvaluationsDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog}
        evaluations={filteredEvaluations}
      />
      
      {/* Delete Dialog */}
      <DeleteEvaluationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        evaluation={selectedEvaluation}
      />
    </div>
  );
};

export default EmployeesEvaluations;
