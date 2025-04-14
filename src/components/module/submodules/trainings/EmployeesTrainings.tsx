
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  List, 
  Grid, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Trash2, 
  Eye 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, getDocs, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Skeleton } from "@/components/ui/skeleton";
import DeleteTrainingDialog from './DeleteTrainingDialog';
import CreateTrainingDialog, { Training } from './CreateTrainingDialog';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';

const EmployeesTrainings = () => {
  const { employees } = useEmployeeData();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch trainings from Firestore
  useEffect(() => {
    setIsLoading(true);
    
    const trainingsRef = collection(db, COLLECTIONS.HR.TRAININGS);
    const q = query(trainingsRef, orderBy('startDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trainingsList: Training[] = [];
      snapshot.forEach((doc) => {
        trainingsList.push({
          id: doc.id,
          ...doc.data()
        } as Training);
      });
      
      setTrainings(trainingsList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching trainings: ", error);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Filter trainings based on search term and filters
  const filteredTrainings = trainings.filter(training => {
    // Apply search filter
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || training.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-500">Planifiée</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get training type display name
  const getTrainingType = (type: string) => {
    switch (type) {
      case 'technical':
        return 'Technique';
      case 'soft_skills':
        return 'Compétences douces';
      case 'management':
        return 'Management';
      case 'security':
        return 'Sécurité';
      case 'onboarding':
        return 'Intégration';
      case 'compliance':
        return 'Conformité';
      default:
        return type;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    // Refresh will come from the snapshot listener
  };
  
  // Handle training creation
  const handleTrainingSubmit = (training: Training) => {
    setCreateDialogOpen(false);
    // New training will be added via the snapshot listener
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold">Formations</h2>
          <p className="text-muted-foreground">
            Gérez les formations des employés
          </p>
        </div>
        
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle formation
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <CardTitle>Formations</CardTitle>
            
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une formation..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planned">Planifiée</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="technical">Technique</SelectItem>
                  <SelectItem value="soft_skills">Compétences douces</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="onboarding">Intégration</SelectItem>
                  <SelectItem value="compliance">Conformité</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Formateur</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Aucune formation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.title}</TableCell>
                      <TableCell>{training.instructor}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>Début: {formatDate(training.startDate)}</div>
                          <div>Fin: {formatDate(training.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTrainingType(training.type)}</TableCell>
                      <TableCell>{getStatusBadge(training.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setSelectedTraining(training);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTrainings.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  Aucune formation trouvée
                </div>
              ) : (
                filteredTrainings.map((training) => (
                  <Card key={training.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{training.title}</CardTitle>
                        {getStatusBadge(training.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        {training.instructor}
                      </div>
                      <div className="text-xs mb-4">
                        <div>Début: {formatDate(training.startDate)}</div>
                        <div>Fin: {formatDate(training.endDate)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-4 line-clamp-2">
                        {training.description}
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{getTrainingType(training.type)}</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setSelectedTraining(training);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                Affichage calendrier en développement
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <DeleteTrainingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        training={selectedTraining}
      />
      
      <CreateTrainingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleTrainingSubmit}
        employees={employees as Employee[]}
      />
    </div>
  );
};

export default EmployeesTrainings;
