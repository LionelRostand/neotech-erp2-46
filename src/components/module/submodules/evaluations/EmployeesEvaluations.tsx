
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Plus, Trash2, FileDown } from 'lucide-react';
import { useEvaluationsData, Evaluation } from '@/hooks/useEvaluationsData';
import { toast } from 'sonner';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useNavigate } from 'react-router-dom';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EvaluationsFilter from './EvaluationsFilter';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import EditEvaluationDialog from './EditEvaluationDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';

const EmployeesEvaluations: React.FC = () => {
  const navigate = useNavigate();
  const { evaluations, stats, refreshData } = useEvaluationsData();
  const { employees } = useEmployeeData();
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>(evaluations);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  
  // Handle filter
  const handleFilterApplied = (filtered: Evaluation[]) => {
    if (filtered && filtered.length > 0) {
      setFilteredEvaluations(filtered);
    } else {
      setFilteredEvaluations(evaluations);
    }
  };
  
  // Handle view evaluation details
  const handleViewEvaluation = (evaluation: Evaluation) => {
    if (evaluation.employeeId) {
      navigate(`/modules/employees/profiles?id=${evaluation.employeeId}&tab=evaluations`);
    } else {
      toast.error("Impossible de trouver l'employé associé à cette évaluation");
    }
  };
  
  // Handle edit evaluation
  const handleEditEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditDialogOpen(true);
  };
  
  // Handle delete evaluation
  const handleDeleteClick = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteEvaluation = async () => {
    if (!selectedEvaluation) return;
    
    try {
      if (selectedEvaluation.fromEmployeeRecord && selectedEvaluation.employeeId) {
        // If this evaluation is from an employee record, we need to update the employee
        const employee = employees.find(emp => emp.id === selectedEvaluation.employeeId);
        
        if (employee && employee.evaluations) {
          const updatedEvaluations = employee.evaluations.filter(
            ev => ev.id !== selectedEvaluation.id
          );
          
          // Update employee record
          await updateEmployeeEvaluations(selectedEvaluation.employeeId, updatedEvaluations);
        }
      } else {
        // Regular evaluation from the evaluations collection
        await deleteDocument(COLLECTIONS.HR.EVALUATIONS, selectedEvaluation.id);
      }
      
      toast.success('Évaluation supprimée avec succès');
      refreshData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'évaluation :', error);
      toast.error('Erreur lors de la suppression de l\'évaluation');
    }
  };
  
  // Helper function to update employee evaluations
  const updateEmployeeEvaluations = async (employeeId: string, evaluations: any[]) => {
    // This is a placeholder function
    // You would need to implement the actual update logic
    console.log(`Updating evaluations for employee ${employeeId}`);
    console.log(evaluations);
    // await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, { evaluations });
  };

  // Handle refresh after operations
  const handleOperationSuccess = () => {
    refreshData();
    toast.success('Opération réussie');
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return 'bg-blue-100 text-blue-800';
      case 'Complétée':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Évaluations des employés</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setExportDialogOpen(true)}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Exporter
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-2xl font-bold text-blue-600">{stats.planned}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des évaluations</h2>
        <EvaluationsFilter onFilterApplied={handleFilterApplied} />
      </div>
      
      <Card>
        <div className="p-1">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Employé</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Score</th>
                <th className="px-4 py-3 text-left font-medium">Évaluateur</th>
                <th className="px-4 py-3 text-left font-medium">Département</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {evaluation.employeePhoto && (
                          <img 
                            src={evaluation.employeePhoto} 
                            alt={evaluation.employeeName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span>{evaluation.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{evaluation.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(evaluation.status)}`}>
                        {evaluation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {evaluation.score !== undefined 
                        ? `${evaluation.score}/${evaluation.maxScore || 100}` 
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">{evaluation.evaluatorName || 'Non assigné'}</td>
                    <td className="px-4 py-3">{evaluation.department || 'Non spécifié'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewEvaluation(evaluation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvaluation(evaluation)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(evaluation)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Aucune évaluation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Dialogs */}
      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleOperationSuccess}
      />
      
      <EditEvaluationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        evaluation={selectedEvaluation}
        onSuccess={handleOperationSuccess}
      />
      
      <DeleteEvaluationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        evaluation={selectedEvaluation}
        onDelete={handleDeleteEvaluation}
      />
      
      <ExportEvaluationsDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        evaluations={filteredEvaluations}
      />
    </div>
  );
};

export default EmployeesEvaluations;
