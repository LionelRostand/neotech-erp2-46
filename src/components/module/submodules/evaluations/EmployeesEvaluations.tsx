
import React, { useState } from 'react';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusCircle, Filter, FileExport, Edit, Trash, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { addDocument, updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import EvaluationsFilter from './EvaluationsFilter';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';

const EmployeesEvaluations = () => {
  const { evaluations, refreshData, isLoading } = useEvaluationsData();
  const { employees } = useEmployeeData();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    status: 'all'
  });
  
  // Filter evaluations based on filter criteria
  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filters.status !== 'all' && evaluation.status !== filters.status) {
      return false;
    }
    return true;
  });
  
  const handleCreateEvaluation = async (data: any) => {
    try {
      // Find employee name
      const employee = employees.find(emp => emp.id === data.employeeId);
      const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
      
      // Find evaluator name if exists
      let evaluatorName = '';
      if (data.evaluatorId && data.evaluatorId !== '') {
        const evaluator = employees.find(emp => emp.id === data.evaluatorId);
        evaluatorName = evaluator ? `${evaluator.firstName} ${evaluator.lastName}` : '';
      }
      
      // Prepare data for Firestore
      const evaluationData = {
        employeeId: data.employeeId,
        employeeName,
        evaluatorId: data.evaluatorId !== 'none' ? data.evaluatorId : '',
        evaluatorName,
        date: data.date.toISOString(),
        status: data.status,
        title: data.title,
        comments: data.comments,
        createdAt: new Date().toISOString(),
      };
      
      // Save to Firestore
      await addDocument(COLLECTIONS.HR.EVALUATIONS, evaluationData);
      
      toast.success('Évaluation créée avec succès');
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      toast.error('Erreur lors de la création de l\'évaluation');
    }
  };
  
  const handleViewEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setShowViewDialog(true);
  };
  
  const handleDeleteEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteEvaluation = async (id: string) => {
    try {
      await deleteDocument(COLLECTIONS.HR.EVALUATIONS, id);
      toast.success('Évaluation supprimée avec succès');
      setShowDeleteDialog(false);
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'évaluation:', error);
      toast.error('Erreur lors de la suppression de l\'évaluation');
    }
  };
  
  const handleCompleteEvaluation = async (evaluation: any) => {
    try {
      // Update status to completed
      await updateDocument(
        COLLECTIONS.HR.EVALUATIONS,
        evaluation.id,
        { status: 'Complétée', completedAt: new Date().toISOString() }
      );
      
      toast.success('Évaluation marquée comme complétée');
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };
  
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Évaluations des employés</h1>
          <p className="text-muted-foreground">
            Gérez les évaluations de performance de vos employés
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowExportDialog(true)}
          >
            <FileExport className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          
          <Button
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Chargement des évaluations...</p>
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">Aucune évaluation trouvée</p>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une évaluation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{evaluation.title || 'Évaluation'}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <span 
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          evaluation.status === 'Planifiée' ? 'bg-blue-500' : 
                          evaluation.status === 'Complétée' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      {evaluation.status}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employé:</span>
                    <span className="font-medium">{evaluation.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Évaluateur:</span>
                    <span className="font-medium">{evaluation.evaluatorName || 'Non assigné'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{evaluation.date}</span>
                  </div>
                  {evaluation.comments && (
                    <div className="mt-2">
                      <span className="text-muted-foreground">Commentaires:</span>
                      <p className="text-sm mt-1 line-clamp-2">{evaluation.comments}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-1 flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewEvaluation(evaluation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEvaluation(evaluation)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                {evaluation.status === 'Planifiée' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCompleteEvaluation(evaluation)}
                  >
                    <FileCheck className="mr-2 h-4 w-4" />
                    Compléter
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Evaluation Dialog */}
      <CreateEvaluationDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateEvaluation}
        onSuccess={() => {
          setShowCreateDialog(false);
          refreshData();
        }}
        employees={employees}
      />
      
      {/* Filter Dialog */}
      <EvaluationsFilter
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
      
      {/* Export Dialog */}
      <ExportEvaluationsDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        evaluations={filteredEvaluations}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteEvaluationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => selectedEvaluation && confirmDeleteEvaluation(selectedEvaluation.id)}
        evaluation={selectedEvaluation}
      />
      
      {/* View/Edit Dialog */}
      {showViewDialog && selectedEvaluation && (
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails de l'évaluation</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="font-medium">Employé</h3>
                  <p>{selectedEvaluation.employeeName}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Évaluateur</h3>
                  <p>{selectedEvaluation.evaluatorName || 'Non assigné'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Date de l'évaluation</h3>
                  <p>{selectedEvaluation.date}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Statut</h3>
                  <p>{selectedEvaluation.status}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Commentaires</h3>
                  <p className="whitespace-pre-line">{selectedEvaluation.comments || 'Aucun commentaire'}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Fermer
              </Button>
              {selectedEvaluation.status === 'Planifiée' && (
                <Button onClick={() => {
                  handleCompleteEvaluation(selectedEvaluation);
                  setShowViewDialog(false);
                }}>
                  Marquer comme complétée
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesEvaluations;
