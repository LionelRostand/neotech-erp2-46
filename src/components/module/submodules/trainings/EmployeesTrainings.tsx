
import React, { useState, useEffect } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Filter, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import StatusBadge from './StatusBadge';
import CreateTrainingDialog from './CreateTrainingDialog';
import { Column } from '@/types/table-types';
import { Employee } from '@/types/employee';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { addDocument, deleteDocument, updateDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EmployeesTrainings = () => {
  // Component state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Data hooks
  const { trainings, stats, isLoading } = useTrainingsData(refreshTrigger);
  const { employees } = useHrModuleData();
  
  // Filtered trainings based on search and filters
  const filteredTrainings = React.useMemo(() => {
    if (!trainings) return [];
    
    return trainings.filter(training => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
      
      // Employee filter
      const matchesEmployee = employeeFilter === 'all' || training.employeeId === employeeFilter;
      
      // Tab filter
      if (selectedTab === 'all') {
        return matchesSearch && matchesStatus && matchesEmployee;
      } else if (selectedTab === 'inProgress') {
        return matchesSearch && matchesEmployee && training.status === 'En cours';
      } else if (selectedTab === 'scheduled') {
        return matchesSearch && matchesEmployee && training.status === 'Planifiée';
      } else if (selectedTab === 'completed') {
        return matchesSearch && matchesEmployee && training.status === 'Terminée';
      } else if (selectedTab === 'cancelled') {
        return matchesSearch && matchesEmployee && training.status === 'Annulée';
      }
      
      return matchesSearch && matchesStatus && matchesEmployee;
    });
  }, [trainings, searchTerm, statusFilter, employeeFilter, selectedTab]);
  
  // Handle status change for a training
  const handleStatusChange = async (trainingId: string, newStatus: string) => {
    try {
      await updateDocument(COLLECTIONS.HR.TRAININGS, trainingId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`Statut mis à jour avec succès`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating training status:', error);
      toast.error(`Erreur lors de la mise à jour du statut`);
    }
  };
  
  // Handle deleting a training
  const handleDeleteTraining = async (trainingId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await deleteDocument(COLLECTIONS.HR.TRAININGS, trainingId);
        toast.success('Formation supprimée avec succès');
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting training:', error);
        toast.error('Erreur lors de la suppression de la formation');
      }
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Define the table columns
  const columns: Column[] = [
    {
      key: 'employee',
      header: 'Employé',
      cell: ({ row }) => {
        const training = row.original as Training;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={training.employeePhoto} alt={training.employeeName} />
              <AvatarFallback>{training.employeeName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{training.employeeName}</div>
              <div className="text-xs text-muted-foreground">{training.department}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'title',
      header: 'Formation',
      cell: ({ row }) => {
        const training = row.original as Training;
        return (
          <div>
            <div className="font-medium">{training.title}</div>
            <div className="text-xs text-muted-foreground">{training.provider}</div>
          </div>
        );
      }
    },
    {
      key: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const training = row.original as Training;
        return training.type;
      }
    },
    {
      key: 'period',
      header: 'Période',
      cell: ({ row }) => {
        const training = row.original as Training;
        return (
          <div>
            <div>{training.startDate}</div>
            {training.endDate && (
              <div className="text-xs text-muted-foreground">
                à {training.endDate}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const training = row.original as Training;
        return (
          <StatusBadge status={training.status}>
            {training.status}
          </StatusBadge>
        );
      }
    }
  ];
  
  // Handle creating a new training
  const handleTrainingCreated = () => {
    setCreateDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Formation créée avec succès');
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Formations</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouvelle formation
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Formations totales</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-xl font-bold">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-xl font-bold">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Terminées</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-xl font-bold">{stats.cancelled}</div>
                <div className="text-sm text-muted-foreground">Annulées</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>Liste des formations</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Rechercher..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[200px]"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminée">Terminée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
              <TabsTrigger value="inProgress">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {/* Trainings table would go here */}
              {isLoading ? (
                <div className="text-center py-4">Chargement des formations...</div>
              ) : filteredTrainings.length === 0 ? (
                <div className="text-center py-4">Aucune formation trouvée</div>
              ) : (
                <div className="space-y-4">
                  {filteredTrainings.map((training) => (
                    <TrainingCard 
                      key={training.id} 
                      training={training} 
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTraining}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {['scheduled', 'inProgress', 'completed', 'cancelled'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">Chargement des formations...</div>
                ) : filteredTrainings.length === 0 ? (
                  <div className="text-center py-4">Aucune formation trouvée</div>
                ) : (
                  <div className="space-y-4">
                    {filteredTrainings.map((training) => (
                      <TrainingCard 
                        key={training.id} 
                        training={training} 
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTraining}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <CreateTrainingDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleTrainingCreated}
        employees={employees as Employee[]}
      />
    </div>
  );
};

// Training Card component
const TrainingCard = ({ 
  training, 
  onStatusChange, 
  onDelete 
}: { 
  training: Training; 
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={training.employeePhoto} alt={training.employeeName} />
              <AvatarFallback>{training.employeeName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold">{training.title}</h3>
              <div className="text-sm text-muted-foreground">{training.employeeName}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {training.provider && (
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Prestataire: {training.provider}
                  </div>
                )}
                {training.location && (
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Lieu: {training.location}
                  </div>
                )}
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Type: {training.type}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={training.status}>
              {training.status}
            </StatusBadge>
            
            <div className="text-sm">
              {training.startDate} {training.endDate ? `→ ${training.endDate}` : ''}
            </div>
            
            <div className="flex gap-2 mt-2">
              <Select 
                defaultValue={training.status} 
                onValueChange={(value) => onStatusChange(training.id, value)}
              >
                <SelectTrigger className="h-8 w-[140px]">
                  <SelectValue placeholder="Changer le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminée">Terminée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(training.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeesTrainings;
