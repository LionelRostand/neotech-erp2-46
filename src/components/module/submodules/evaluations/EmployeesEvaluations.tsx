
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardCheck, 
  Plus,
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import EditEvaluationDialog from './EditEvaluationDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';
import { Evaluation } from '@/hooks/useEvaluationsData';
import { toast } from 'sonner';
import { addDocument, updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EmployeesEvaluations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { evaluations, stats, isLoading, error, refreshData } = useEvaluationsData();
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const handleCreateEvaluation = async (evaluationData: any) => {
    try {
      await addDocument(COLLECTIONS.HR.EVALUATIONS, evaluationData);
      toast.success("Évaluation créée avec succès");
      refreshData();
    } catch (error) {
      console.error("Erreur lors de la création de l'évaluation:", error);
      toast.error("Erreur lors de la création de l'évaluation");
    }
  };

  const handleUpdateEvaluation = async (evaluationData: any) => {
    if (!selectedEvaluation) return;
    
    try {
      await updateDocument(COLLECTIONS.HR.EVALUATIONS, selectedEvaluation.id, evaluationData);
      toast.success("Évaluation mise à jour avec succès");
      refreshData();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'évaluation:", error);
      toast.error("Erreur lors de la mise à jour de l'évaluation");
    }
  };

  const handleDeleteEvaluation = async () => {
    if (!selectedEvaluation) return;
    
    try {
      await deleteDocument(COLLECTIONS.HR.EVALUATIONS, selectedEvaluation.id);
      toast.success("Évaluation supprimée avec succès");
      refreshData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'évaluation:", error);
      toast.error("Erreur lors de la suppression de l'évaluation");
    }
  };

  const handleEditClick = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des évaluations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des évaluations.
      </div>
    );
  }

  const filteredEvaluations = activeTab === 'all' 
    ? evaluations 
    : evaluations?.filter(evaluation => evaluation.status.toLowerCase() === activeTab) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Évaluations</h2>
          <p className="text-gray-500">Gestion des évaluations du personnel</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle évaluation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-500">{stats?.planned || 0}</div>
            <div className="text-sm text-gray-500">Évaluations planifiées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-500">{stats?.completed || 0}</div>
            <div className="text-sm text-gray-500">Évaluations complétées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-500">{stats?.total || 0}</div>
            <div className="text-sm text-gray-500">Total</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="planifiée">Planifiées</TabsTrigger>
          <TabsTrigger value="complétée">Complétées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              {filteredEvaluations.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <ClipboardCheck className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucune évaluation trouvée</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {filteredEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="border rounded-md p-4 hover:bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{evaluation.employeeName}</div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          evaluation.status === 'Planifiée' ? 'bg-blue-100 text-blue-800' : 
                          evaluation.status === 'Complétée' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {evaluation.status}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User className="w-4 h-4 mr-1" />
                        Évaluateur: {evaluation.evaluatorName || 'Non assigné'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        Date: {evaluation.date}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(evaluation)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(evaluation)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogues pour créer, modifier et supprimer */}
      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateEvaluation}
      />
      
      {selectedEvaluation && (
        <>
          <EditEvaluationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            evaluation={selectedEvaluation}
            onSubmit={handleUpdateEvaluation}
          />
          
          <DeleteEvaluationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            evaluation={selectedEvaluation}
            onDelete={handleDeleteEvaluation}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesEvaluations;
