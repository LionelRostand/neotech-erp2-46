
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tab";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  ChevronDown, 
  MoreHorizontal, 
  Plus, 
  Search, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar, 
  MapPin 
} from "lucide-react";
import DeleteTrainingDialog from "@/components/module/submodules/trainings/DeleteTrainingDialog";
import CreateTrainingDialog from "@/components/module/submodules/trainings/CreateTrainingDialog";
import { useTrainingsData, Training } from "@/hooks/useTrainingsData";
import { useHrModuleData } from "@/hooks/useHrModuleData";
import { toast } from "sonner";
import { deleteTrainingDocument } from "@/hooks/firestore/delete-operations";

const EmployeesTrainings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [view, setView] = useState<'list' | 'grid'>('list');

  const { trainings, stats, isLoading } = useTrainingsData(refreshTrigger);
  const { employees } = useHrModuleData();

  // Handle search and filtering
  const filteredTrainings = trainings.filter(training => {
    // Filter by search term
    const matchesSearch = 
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);
  const paginatedTrainings = filteredTrainings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Données actualisées');
  };

  // Handle training deletion
  const handleDeleteTraining = async () => {
    if (!selectedTraining) return;
    
    try {
      await deleteTrainingDocument(selectedTraining.id);
      setRefreshTrigger(prev => prev + 1);
      toast.success('Formation supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la formation');
    }
  };

  // Handle training creation
  const handleCreateTraining = (training: Training) => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Planifiée
          </Badge>
        );
      case 'En cours':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'Terminée':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminée
          </Badge>
        );
      case 'Annulée':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Formations</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle formation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des formations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Formations planifiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">
              Formations en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Formations terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une formation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Planifiée">Planifiées</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminées</SelectItem>
            <SelectItem value="Annulée">Annulées</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'grid')}>
          <TabsList className="grid grid-cols-2 w-[120px]">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="grid">Grille</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" onClick={handleRefresh}>
          Actualiser
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Training List View */}
      <TabsContent value="list" className="mt-0">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prestataire</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Chargement des formations...
                    </TableCell>
                  </TableRow>
                ) : paginatedTrainings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Aucune formation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {training.employeePhoto ? (
                              <AvatarImage src={training.employeePhoto} alt={training.employeeName} />
                            ) : null}
                            <AvatarFallback>{training.employeeName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{training.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{training.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{training.title}</div>
                        <div className="text-sm text-muted-foreground">{training.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{training.startDate}</span>
                        </div>
                        {training.endDate && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="ml-5">au {training.endDate}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{renderStatusBadge(training.status)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{training.provider || '-'}</div>
                        {training.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {training.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedTraining(training);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Training Grid View */}
      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p className="col-span-full text-center py-10">Chargement des formations...</p>
          ) : paginatedTrainings.length === 0 ? (
            <p className="col-span-full text-center py-10">Aucune formation trouvée</p>
          ) : (
            paginatedTrainings.map((training) => (
              <Card key={training.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{training.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedTraining(training);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-9 w-9">
                      {training.employeePhoto ? (
                        <AvatarImage src={training.employeePhoto} alt={training.employeeName} />
                      ) : null}
                      <AvatarFallback>{training.employeeName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{training.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{training.department}</div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-sm font-medium">{training.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <span>{renderStatusBadge(training.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="text-sm">{training.startDate}</span>
                    </div>
                    {training.provider && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Prestataire</span>
                        <span className="text-sm">{training.provider}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mx-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Dialog */}
      {selectedTraining && (
        <DeleteTrainingDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          training={selectedTraining}
          onConfirm={handleDeleteTraining}
        />
      )}

      {/* Create Dialog */}
      <CreateTrainingDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateTraining}
        employees={employees || []}
      />
    </div>
  );
};

export default EmployeesTrainings;
