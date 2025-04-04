
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ChartBar, 
  ListFilter, 
  Plus,
  Download,
  Clipboard,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import CreateEvaluationDialog from './evaluations/CreateEvaluationDialog';
import EvaluationsFilter from './evaluations/EvaluationsFilter';
import ExportEvaluationsDialog from './evaluations/ExportEvaluationsDialog';

const EmployeesEvaluations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('evaluations');
  const { evaluations, stats, isLoading, error } = useEvaluationsData();
  const [filteredEvaluations, setFilteredEvaluations] = useState(evaluations);
  const [filters, setFilters] = useState({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  React.useEffect(() => {
    setFilteredEvaluations(evaluations);
  }, [evaluations]);

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    
    // Appliquer les filtres sur les données
    if (Object.keys(newFilters).length === 0) {
      setFilteredEvaluations(evaluations);
      return;
    }
    
    const filtered = evaluations.filter(evaluation => {
      let pass = true;
      
      if (newFilters.employee && evaluation.employeeName) {
        pass = pass && evaluation.employeeName.toLowerCase().includes(newFilters.employee.toLowerCase());
      }
      
      if (newFilters.department && evaluation.department) {
        pass = pass && evaluation.department === newFilters.department;
      }
      
      if (newFilters.status) {
        pass = pass && evaluation.status === newFilters.status;
      }
      
      if (newFilters.dateFrom) {
        const evalDate = new Date(evaluation.date.split('/').reverse().join('-'));
        const fromDate = new Date(newFilters.dateFrom);
        pass = pass && evalDate >= fromDate;
      }
      
      if (newFilters.dateTo) {
        const evalDate = new Date(evaluation.date.split('/').reverse().join('-'));
        const toDate = new Date(newFilters.dateTo);
        pass = pass && evalDate <= toDate;
      }
      
      if (newFilters.scoreMin && evaluation.score !== undefined) {
        pass = pass && evaluation.score >= parseInt(newFilters.scoreMin);
      }
      
      if (newFilters.scoreMax && evaluation.score !== undefined) {
        pass = pass && evaluation.score <= parseInt(newFilters.scoreMax);
      }
      
      return pass;
    });
    
    setFilteredEvaluations(filtered);
  };

  const handleExportData = () => {
    setShowExportDialog(true);
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

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des évaluations</h2>
          <p className="text-gray-500">Entretiens et évaluations professionnelles</p>
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
            Nouvelle évaluation
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Planifiées</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.planned}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Complétées</h3>
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
            <ChartBar className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-3">
          <TabsTrigger value="evaluations" className="flex items-center">
            <Clipboard className="h-4 w-4 mr-2" />
            Évaluations
          </TabsTrigger>
          <TabsTrigger value="modeles" className="flex items-center">
            <ChartBar className="h-4 w-4 mr-2" />
            Modèles
          </TabsTrigger>
          <TabsTrigger value="rapports" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employé</TableHead>
                      <TableHead>Évaluateur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvaluations.length > 0 ? (
                      filteredEvaluations.map((evaluation) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={evaluation.employeePhoto} alt={evaluation.employeeName} />
                                <AvatarFallback>{evaluation.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{evaluation.employeeName}</p>
                                <p className="text-xs text-gray-500">{evaluation.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{evaluation.evaluatorName}</TableCell>
                          <TableCell>{evaluation.date}</TableCell>
                          <TableCell>
                            {evaluation.score !== undefined ? (
                              <div className="flex items-center">
                                <span className="font-medium">{evaluation.score}</span>
                                <span className="text-xs text-gray-500 ml-1">/ {evaluation.maxScore}</span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                evaluation.status === 'Complétée'
                                  ? 'bg-green-100 text-green-800'
                                  : evaluation.status === 'Annulée'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {evaluation.status}
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
                        <TableCell colSpan={6} className="h-24 text-center">
                          Aucune évaluation trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeles">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Modèles d'évaluation (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rapports">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Rapports d'évaluations (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Modals */}
      <CreateEvaluationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      
      <EvaluationsFilter
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        onApplyFilters={applyFilters}
      />
      
      <ExportEvaluationsDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        data={filteredEvaluations}
      />
    </div>
  );
};

export default EmployeesEvaluations;
