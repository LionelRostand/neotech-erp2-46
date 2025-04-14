
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Evaluation, useEvaluationsData } from '@/hooks/useEvaluationsData';
import { Plus, FileDown, Pencil, Trash2, RefreshCw, Check, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import EditEvaluationDialog from './EditEvaluationDialog';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';
import EvaluationsFilter from './EvaluationsFilter';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface EvaluationsFilterProps {
  onFilterApplied: (filtered: any) => void;
}

// Add missing props interfaces for dialogs
interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: Evaluation | null;
  onSuccess?: () => void;
}

interface ExportEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluations?: Evaluation[];
}

const EmployeesEvaluations: React.FC = () => {
  const { evaluations, isLoading, refreshData } = useEvaluationsData();
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (evaluations) {
      setFilteredEvaluations(evaluations);
    }
  }, [evaluations]);

  const handleFilterApplied = (filtered) => {
    setFilteredEvaluations(filtered);
  };

  const handleRefresh = () => {
    refreshData();
    toast.info('Données actualisées');
  };

  const getStatusElement = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return <StatusBadge status="warning">
          <Clock className="w-3 h-3 mr-1" />
          Planifiée
        </StatusBadge>;
      case 'Complétée':
        return <StatusBadge status="success">
          <Check className="w-3 h-3 mr-1" />
          Complétée
        </StatusBadge>;
      case 'Annulée':
        return <StatusBadge status="danger">
          <XCircle className="w-3 h-3 mr-1" />
          Annulée
        </StatusBadge>;
      default:
        return <StatusBadge status="default">{status}</StatusBadge>;
    }
  };

  const handleEdit = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditDialogOpen(true);
  };

  const handleDelete = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvaluation) return;

    setIsDeleting(true);
    try {
      // Delete the evaluation from Firestore
      await deleteDocument(COLLECTIONS.HR.EVALUATIONS, selectedEvaluation.id);
      
      toast.success('Évaluation supprimée avec succès');
      refreshData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'évaluation');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewEmployee = (employeeId: string) => {
    navigate(`/modules/employees/profiles?id=${employeeId}`);
  };

  const evaluationColumns = [
    {
      key: 'date',
      header: 'Date',
      cell: ({ row }) => <span>{row.original.date}</span>
    },
    {
      key: 'employeeName',
      header: 'Employé',
      cell: ({ row }) => (
        <div 
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => handleViewEmployee(row.original.employeeId)}
        >
          {row.original.employeeName}
        </div>
      )
    },
    {
      key: 'department',
      header: 'Département',
      cell: ({ row }) => <span>{row.original.department}</span>
    },
    {
      key: 'evaluatorName',
      header: 'Évaluateur',
      cell: ({ row }) => <span>{row.original.evaluatorName}</span>
    },
    {
      key: 'score',
      header: 'Score',
      cell: ({ row }) => (
        <span>
          {row.original.score || row.original.rating || 0}
          {row.original.maxScore ? `/${row.original.maxScore}` : ''}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }) => getStatusElement(row.original.status)
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Évaluations des employés</h1>
          <p className="text-gray-500">Gérez les évaluations et suivez la progression des employés</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setExportDialogOpen(true)}
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
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {evaluations.filter(e => e.status === 'Planifiée').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {evaluations.filter(e => e.status === 'Complétée').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {evaluations.filter(e => e.status === 'Annulée').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <EvaluationsFilter onFilterApplied={handleFilterApplied} />
      
      <div className="bg-white rounded-lg shadow">
        <DataTable 
          title="Liste des évaluations"
          columns={evaluationColumns}
          data={filteredEvaluations}
        />
      </div>
      
      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          refreshData();
          setCreateDialogOpen(false);
          toast.success('Évaluation créée avec succès');
        }}
      />
      
      <EditEvaluationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        evaluation={selectedEvaluation}
        onSuccess={() => {
          refreshData();
          setEditDialogOpen(false);
          toast.success('Évaluation mise à jour avec succès');
        }}
      />
      
      <DeleteEvaluationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        evaluation={selectedEvaluation}
        onDelete={confirmDelete}
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
