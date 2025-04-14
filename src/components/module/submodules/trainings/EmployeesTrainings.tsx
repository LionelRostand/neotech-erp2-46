
import React, { useState, useEffect } from 'react';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  MoreVertical, 
  FileEdit, 
  Trash2, 
  Download, 
  Calendar,
  Grid3X3,
  List
} from 'lucide-react';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import CreateTrainingDialog from './CreateTrainingDialog';
import { useHrModuleData } from '@/hooks/useHrModuleData';

// Helper function to get badge color based on training status
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Planifiée':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'En cours':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Terminée':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Annulée':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const EmployeesTrainings = () => {
  const { trainings, stats, isLoading } = useTrainingsData();
  const { employees } = useHrModuleData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);

  // Apply filters when values change
  useEffect(() => {
    if (!trainings) return;
    
    let result = [...trainings];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (training) =>
          training.title.toLowerCase().includes(searchLower) ||
          training.employeeName?.toLowerCase().includes(searchLower) ||
          training.provider?.toLowerCase().includes(searchLower) ||
          training.type.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter((training) => training.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter) {
      result = result.filter((training) => training.type === typeFilter);
    }
    
    setFilteredTrainings(result);
  }, [trainings, searchTerm, statusFilter, typeFilter]);

  // Handle opening the delete dialog
  const handleDeleteClick = (training: Training) => {
    setSelectedTraining(training);
    setIsDeleteDialogOpen(true);
  };

  // Handle training deletion
  const handleDeleteConfirm = () => {
    // No need to call any function here as it's already handled in the DeleteTrainingDialog component
    setIsDeleteDialogOpen(false);
    setSelectedTraining(null);
  };

  // Handle opening the edit dialog (to be implemented)
  const handleEditClick = (training: Training) => {
    console.log('Edit training:', training);
    // To be implemented
  };

  // Handle training dialog submission
  const handleTrainingDialogSubmit = (trainingData: Partial<Training>) => {
    console.log('Training submitted:', trainingData);
    setIsCreateDialogOpen(false);
    // Refresh will happen automatically via listener in useTrainingsData
  };
  
  // Handle training dialog close
  const handleTrainingDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  // Generate a list of unique training types for the filter
  const trainingTypes = trainings ? 
    Array.from(new Set(trainings.map((t) => t.type))).sort() : 
    [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Formations</h1>
          <p className="text-muted-foreground">
            Gestion des formations et certifications des employés
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle formation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total formations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Formations planifiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.planned || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Formations en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.inProgress || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Formations terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une formation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Statut" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="Planifiée">Planifiée</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
            <SelectItem value="Annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type de formation" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            {trainingTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-r-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-l-none border-l"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="ongoing">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {viewMode === 'list' ? (
            <TrainingsTable 
              trainings={filteredTrainings} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          ) : (
            <TrainingsGrid 
              trainings={filteredTrainings} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          )}
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          {viewMode === 'list' ? (
            <TrainingsTable 
              trainings={filteredTrainings.filter(t => t.status === 'Planifiée')} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          ) : (
            <TrainingsGrid 
              trainings={filteredTrainings.filter(t => t.status === 'Planifiée')} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          )}
        </TabsContent>
        <TabsContent value="ongoing" className="mt-4">
          {viewMode === 'list' ? (
            <TrainingsTable 
              trainings={filteredTrainings.filter(t => t.status === 'En cours')} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          ) : (
            <TrainingsGrid 
              trainings={filteredTrainings.filter(t => t.status === 'En cours')} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {viewMode === 'list' ? (
            <TrainingsTable 
              trainings={filteredTrainings.filter(t => t.status === 'Terminée')} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          ) : (
            <TrainingsGrid 
              trainings={filteredTrainings.filter(t => t.status === 'Terminée')} 
              onDeleteClick={handleDeleteClick} 
              onEditClick={handleEditClick} 
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Training Confirmation Dialog */}
      <DeleteTrainingDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        training={selectedTraining}
      />

      {/* Create Training Dialog */}
      <CreateTrainingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClose={handleTrainingDialogClose}
        onSubmit={handleTrainingDialogSubmit}
        employees={employees}
      />
    </div>
  );
};

// Training Table component
interface TrainingsTableProps {
  trainings: Training[];
  onDeleteClick: (training: Training) => void;
  onEditClick: (training: Training) => void;
}

const TrainingsTable: React.FC<TrainingsTableProps> = ({ trainings, onDeleteClick, onEditClick }) => {
  if (trainings.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">Aucune formation trouvée</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.map((training) => (
            <TableRow key={training.id}>
              <TableCell className="font-medium">{training.title}</TableCell>
              <TableCell>{training.employeeName}</TableCell>
              <TableCell>{training.type}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(training.status)}>
                  {training.status}
                </Badge>
              </TableCell>
              <TableCell>
                {training.startDate}
                {training.endDate && ` → ${training.endDate}`}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditClick(training)}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Éditer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteClick(training)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Training Grid component
interface TrainingsGridProps {
  trainings: Training[];
  onDeleteClick: (training: Training) => void;
  onEditClick: (training: Training) => void;
}

const TrainingsGrid: React.FC<TrainingsGridProps> = ({ trainings, onDeleteClick, onEditClick }) => {
  if (trainings.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">Aucune formation trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainings.map((training) => (
        <Card key={training.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{training.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditClick(training)}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Éditer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteClick(training)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Badge className={`mt-1 ${getStatusColor(training.status)}`}>
              {training.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employé:</span>
                <span className="font-medium">{training.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{training.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dates:</span>
                <span>
                  {training.startDate}
                  {training.endDate && ` → ${training.endDate}`}
                </span>
              </div>
              {training.provider && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organisme:</span>
                  <span>{training.provider}</span>
                </div>
              )}
              {training.cost !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coût:</span>
                  <span>{training.cost.toLocaleString('fr-FR')} €</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmployeesTrainings;
