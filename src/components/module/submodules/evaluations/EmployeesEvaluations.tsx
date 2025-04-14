import React, { useState, useEffect } from 'react';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, Search, Filter, FileDown, Trash, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateEvaluationDialog from './CreateEvaluationDialog';
import DeleteEvaluationDialog from './DeleteEvaluationDialog';
import EvaluationsFilter from './EvaluationsFilter';
import ExportEvaluationsDialog from './ExportEvaluationsDialog';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/hooks/firestore/add-operations';

interface Evaluation {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  evaluatorId?: string;
  evaluatorName?: string;
  date: string;
  score?: number;
  maxScore?: number;
  status: 'Planifiée' | 'Complétée' | 'Annulée';
  comments?: string;
  department?: string;
  goals?: string[];
  strengths?: string[];
  improvements?: string[];
  title?: string;
  rating?: number;
  fromEmployeeRecord?: boolean;
}

const EmployeesEvaluations: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { evaluations, isLoading, error, refreshData } = useEvaluationsData();

  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    let results = evaluations;

    if (searchTerm) {
      results = results.filter(evaluation =>
        evaluation.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus && filterStatus !== 'all') {
      results = results.filter(evaluation => evaluation.status === filterStatus);
    }

    setFilteredEvaluations(results);
  }, [evaluations, searchTerm, filterStatus]);

  const handleCreateEvaluation = async (data: any) => {
    try {
      await addDocument(COLLECTIONS.HR.EVALUATIONS, {
        ...data,
        date: data.date.toISOString(),
        createdAt: new Date().toISOString()
      });
      
      refreshData();
    } catch (error) {
      console.error('Error creating evaluation:', error);
    }
  };

  const handleDeleteEvaluation = async () => {
    if (!selectedEvaluation) return;
    
    try {
      // Implementation of delete operation
      refreshData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting evaluation:', error);
    }
  };

  const filteredEvaluationsByTab = () => {
    if (activeTab === 'all') {
      return filteredEvaluations;
    } else {
      return filteredEvaluations.filter(evaluation => evaluation.status === activeTab);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-4 p-4 pt-0">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Évaluations des employés</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setExportDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.filter(e => e.status === 'Planifiée').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.filter(e => e.status === 'Complétée').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.filter(e => e.status === 'Annulée').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Toutes les évaluations</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFilterDialogOpen(true)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="Planifiée">Planifiées</TabsTrigger>
              <TabsTrigger value="Complétée">Complétées</TabsTrigger>
              <TabsTrigger value="Annulée">Annulées</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluationsByTab().map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={evaluation.employeePhoto} />
                            <AvatarFallback>{evaluation.employeeName?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{evaluation.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={evaluation.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            // Implement edit functionality here
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="Planifiée" className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluationsByTab().map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={evaluation.employeePhoto} />
                            <AvatarFallback>{evaluation.employeeName?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{evaluation.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={evaluation.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            // Implement edit functionality here
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="Complétée" className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluationsByTab().map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={evaluation.employeePhoto} />
                            <AvatarFallback>{evaluation.employeeName?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{evaluation.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={evaluation.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            // Implement edit functionality here
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="Annulée" className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluationsByTab().map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={evaluation.employeePhoto} />
                            <AvatarFallback>{evaluation.employeeName?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{evaluation.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={evaluation.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            // Implement edit functionality here
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEvaluation(evaluation);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateEvaluation}
        onSuccess={() => {
          setCreateDialogOpen(false);
          refreshData();
        }}
        employees={[]} // Pass your employees data here
      />
      
      <DeleteEvaluationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        evaluationId={selectedEvaluation?.id || ''}
        onSuccess={handleDeleteEvaluation}
      />
      
      <ExportEvaluationsDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
      
      <EvaluationsFilter
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        currentStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />
    </div>
  );
};

export default EmployeesEvaluations;
