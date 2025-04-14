
import React, { useState } from 'react';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Trash2, Edit, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import EvaluationsFilter from './EvaluationsFilter';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';

const EmployeesEvaluations = () => {
  const { evaluations, stats, isLoading, error, refreshData } = useEvaluationsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);

  // Filter evaluations based on search query and status
  const filteredEvaluations = evaluations
    .filter(evaluation => 
      (statusFilter === '' || evaluation.status === statusFilter) &&
      (searchQuery === '' || 
        evaluation.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evaluation.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evaluation.comments?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Convert dates to comparable format and sort by most recent first
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleCreateSuccess = () => {
    refreshData();
    toast.success('Évaluation créée avec succès');
  };

  const handleDeleteSuccess = () => {
    refreshData();
    toast.success('Évaluation supprimée avec succès');
  };

  const handleEditEvaluation = (id: string) => {
    // This would be implemented separately
    toast.info(`Édition de l'évaluation ${id} - Fonctionnalité à implémenter`);
  };

  const handleDeleteEvaluation = (id: string) => {
    setSelectedEvaluation(id);
    setShowDeleteDialog(true);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return 'outline';
      case 'Complétée':
        return 'success';
      case 'Annulée':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatRating = (rating?: number) => {
    if (rating === undefined || rating === null) return '-';
    return rating.toFixed(1);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Erreur lors du chargement des évaluations: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="Planifiée">Planifiée</SelectItem>
              <SelectItem value="Complétée">Complétée</SelectItem>
              <SelectItem value="Annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => setShowExportDialog(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Évaluations</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Total: {stats.total}
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50">
                Planifiées: {stats.planned}
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50">
                Complétées: {stats.completed}
              </Badge>
              <Badge variant="outline" className="text-xs bg-red-50">
                Annulées: {stats.cancelled}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                <div className="mt-2 text-sm text-gray-500">Chargement des évaluations...</div>
              </div>
            </div>
          ) : filteredEvaluations.length > 0 ? (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Évaluateur</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.employeeName}</TableCell>
                      <TableCell>{evaluation.title || 'Évaluation régulière'}</TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>{evaluation.evaluatorName}</TableCell>
                      <TableCell>{formatRating(evaluation.rating || evaluation.score)}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(evaluation.status) as "default" | "secondary" | "destructive" | "outline" | "success"}>
                          {evaluation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditEvaluation(evaluation.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteEvaluation(evaluation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 text-center text-muted-foreground">
              {searchQuery || statusFilter ? (
                <div>
                  <p>Aucune évaluation ne correspond à votre recherche.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div>
                  <p>Aucune évaluation enregistrée.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setShowCreateDialog(true)}
                  >
                    Créer la première évaluation
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateEvaluationDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        onSuccess={handleCreateSuccess}
      />

      <EvaluationsFilter 
        open={showFilterDialog} 
        onOpenChange={setShowFilterDialog} 
        currentFilters={{ status: statusFilter }}
        onApplyFilters={(filters) => {
          setStatusFilter(filters.status || '');
        }}
      />

      <ExportEvaluationsDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog} 
        evaluations={filteredEvaluations}
      />

      {selectedEvaluation && (
        <DeleteEvaluationDialog 
          open={showDeleteDialog} 
          onOpenChange={setShowDeleteDialog} 
          evaluationId={selectedEvaluation}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default EmployeesEvaluations;
