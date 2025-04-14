
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { Plus, FileText, Edit, Trash2, UserRound, FilterX, FileSpreadsheet } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import EditEvaluationDialog from './EditEvaluationDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';
import EvaluationsFilter from './EvaluationsFilter';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';
import StatCard from '@/components/StatCard';

const EmployeesEvaluations = () => {
  const { evaluations, stats, isLoading, error, refreshData } = useEvaluationsData();
  const navigate = useNavigate();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [filteredEvaluations, setFilteredEvaluations] = useState(evaluations);
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    setFilteredEvaluations(evaluations);
  }, [evaluations]);
  
  const handleViewEmployeeProfile = (employeeId) => {
    if (!employeeId) {
      toast.error('ID employé non disponible');
      return;
    }
    
    // Navigate to employee profile
    navigate(`/modules/employees/profiles?employeeId=${employeeId}`);
  };
  
  const handleCreate = () => {
    setCreateDialogOpen(true);
  };
  
  const handleEdit = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditDialogOpen(true);
  };
  
  const handleDelete = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setDeleteDialogOpen(true);
  };
  
  const handleExport = () => {
    setExportDialogOpen(true);
  };
  
  const handleFilterApplied = (filtered) => {
    setFilteredEvaluations(filtered);
    setIsFiltered(true);
  };
  
  const handleResetFilters = () => {
    setFilteredEvaluations(evaluations);
    setIsFiltered(false);
  };
  
  const handleSuccess = () => {
    refreshData();
    toast.success('Opération réussie');
  };
  
  const columns = [
    {
      key: 'employeeName',
      header: 'Employé',
      cell: ({ row }) => {
        const evaluation = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={evaluation.employeePhoto} alt={evaluation.employeeName} />
              <AvatarFallback>{evaluation.employeeName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{evaluation.employeeName}</span>
          </div>
        );
      },
    },
    {
      key: 'title',
      header: 'Titre',
      cell: ({ row }) => row.original.title || 'Évaluation périodique',
    },
    {
      key: 'date',
      header: 'Date',
    },
    {
      key: 'evaluatorName',
      header: 'Évaluateur',
    },
    {
      key: 'rating',
      header: 'Note',
      cell: ({ row }) => {
        const evaluation = row.original;
        const score = evaluation.rating || evaluation.score || 0;
        const maxScore = evaluation.maxScore || 5;
        
        return (
          <div className="flex items-center">
            <span className="font-semibold">{score}</span>
            <span className="text-gray-400 text-sm">/{maxScore}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case 'Planifiée':
            return <Badge className="bg-blue-500 hover:bg-blue-600">Planifiée</Badge>;
          case 'Complétée':
            return <Badge className="bg-green-500 hover:bg-green-600">Complétée</Badge>;
          case 'Annulée':
            return <Badge className="bg-red-500 hover:bg-red-600">Annulée</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const evaluation = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleViewEmployeeProfile(evaluation.employeeId)}
              title="Voir le profil de l'employé"
            >
              <UserRound className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEdit(evaluation)}
              title="Modifier l'évaluation"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleDelete(evaluation)}
              title="Supprimer l'évaluation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des évaluations</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total des évaluations" 
          value={`${stats.total}`} 
          icon={<FileText className="h-5 w-5 text-purple-600" />}
          description="Nombre total d'évaluations" 
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <StatCard 
          title="Évaluations planifiées" 
          value={`${stats.planned}`} 
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          description="Évaluations à venir" 
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <StatCard 
          title="Évaluations terminées" 
          value={`${stats.completed}`} 
          icon={<FileText className="h-5 w-5 text-green-600" />}
          description="Évaluations complétées" 
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <StatCard 
          title="Évaluations annulées" 
          value={`${stats.cancelled}`} 
          icon={<FileText className="h-5 w-5 text-red-600" />}
          description="Évaluations annulées" 
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        />
      </div>
      
      <EvaluationsFilter 
        evaluations={evaluations} 
        onFilterApplied={handleFilterApplied} 
      />
      
      {isFiltered && (
        <div className="flex items-center justify-between bg-amber-50 p-2 rounded-md border border-amber-200">
          <p className="text-amber-700 text-sm">Filtres actifs - {filteredEvaluations.length} résultat(s)</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetFilters}
            className="text-amber-700 hover:bg-amber-100"
          >
            <FilterX className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des évaluations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Chargement des évaluations...</div>
          ) : error ? (
            <div className="text-red-500 p-4">Erreur: Impossible de charger les évaluations</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredEvaluations} 
            />
          )}
        </CardContent>
      </Card>
      
      <CreateEvaluationDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSuccess={handleSuccess}
      />
      
      <EditEvaluationDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        evaluation={selectedEvaluation}
        onSuccess={handleSuccess}
      />
      
      <DeleteEvaluationDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        evaluation={selectedEvaluation}
        onSuccess={handleSuccess}
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
