
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Calendar as CalendarIcon, 
  FileDown, 
  Filter, 
  Plus, 
  Search, 
  Trash2 
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEvaluationsData, Evaluation } from "@/hooks/useEvaluationsData";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { addDocument } from "@/hooks/firestore/create-operations";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Import dialog components
import CreateEvaluationDialog from "./CreateEvaluationDialog";
import DeleteEvaluationDialog from "./DeleteEvaluationDialog";
import ExportEvaluationsDialog from "./ExportEvaluationsDialog";
import EvaluationsFilter from "./EvaluationsFilter";

const EmployeesEvaluations = () => {
  // Get evaluations data
  const { evaluations, stats, refreshData } = useEvaluationsData();
  const { employees } = useEmployeeData();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  
  // URL params for status filtering
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize status from URL if available
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus) {
      setStatus(urlStatus);
    }
  }, [searchParams]);
  
  // Update URL when status changes
  useEffect(() => {
    if (status !== 'all') {
      searchParams.set('status', status);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  }, [status, setSearchParams, searchParams]);
  
  // Filter evaluations based on search term and status
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = 
      evaluation.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.evaluatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.comments?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      status === 'all' || 
      evaluation.status === status;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge color
  const getStatusColor = (status: string): "success" | "warning" | "danger" => {
    switch (status) {
      case 'Complétée':
        return 'success';
      case 'Planifiée':
        return 'warning';
      case 'Annulée':
        return 'danger';
      default:
        return 'warning';
    }
  };
  
  // Handle evaluation creation
  const handleCreateEvaluation = async (data: any) => {
    try {
      // Format date to ISO string
      const formattedData = {
        ...data,
        date: data.date.toISOString()
      };
      
      await addDocument(COLLECTIONS.HR.EVALUATIONS, formattedData);
      toast.success('Évaluation créée avec succès');
      refreshData();
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      toast.error('Erreur lors de la création de l\'évaluation');
    }
  };
  
  // Handle evaluation deletion
  const handleDeleteEvaluation = (id: string) => {
    setSelectedEvaluationId(id);
    setDeleteDialogOpen(true);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };
  
  // Get employee initials for avatar
  const getInitials = (name: string = ''): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Évaluations des employés</h2>
          <p className="text-muted-foreground">
            Gérez les évaluations de performance et les entretiens professionnels
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des évaluations</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Évaluations enregistrées
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations planifiées</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planned}</div>
            <p className="text-xs text-muted-foreground">
              À venir
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations complétées</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Réalisées
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations annulées</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">
              Annulées ou reportées
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
            {status !== 'all' && (
              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                {status}
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setExportDialogOpen(true)}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      {/* Evaluations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Évaluations</CardTitle>
          <CardDescription>
            Liste de toutes les évaluations{' '}
            {status !== 'all' ? `filtrées par statut: ${status}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvaluations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Évaluateur</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          {evaluation.employeePhoto ? (
                            <AvatarImage src={evaluation.employeePhoto} alt={evaluation.employeeName} />
                          ) : null}
                          <AvatarFallback>{getInitials(evaluation.employeeName)}</AvatarFallback>
                        </Avatar>
                        <span>{evaluation.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDisplayDate(evaluation.date)}</TableCell>
                    <TableCell>{evaluation.evaluatorName}</TableCell>
                    <TableCell>{evaluation.department}</TableCell>
                    <TableCell>
                      <StatusBadge status={getStatusColor(evaluation.status)}>
                        {evaluation.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEvaluation(evaluation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer l'évaluation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-24 text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Aucune évaluation trouvée</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm ? 
                  "Aucun résultat pour votre recherche. Essayez d'autres termes." : 
                  "Il n'y a pas encore d'évaluations. Commencez par en créer une."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <CreateEvaluationDialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateEvaluation}
        onSuccess={() => refreshData()}
        employees={employees}
      />
      
      <DeleteEvaluationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        evaluationId={selectedEvaluationId || ''}
        onSuccess={() => {
          refreshData();
          setSelectedEvaluationId(null);
        }}
      />
      
      <ExportEvaluationsDialog 
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        evaluations={filteredEvaluations}
      />
      
      <EvaluationsFilter 
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        currentFilters={{ status }}
        onApplyFilters={(filters) => {
          setStatus(filters.status);
        }}
      />
    </div>
  );
};

export default EmployeesEvaluations;
