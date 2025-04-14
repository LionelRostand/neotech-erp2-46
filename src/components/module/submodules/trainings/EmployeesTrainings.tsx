import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubmoduleHeader from '../SubmoduleHeader';
import StatusBadge from './StatusBadge';
import DataTable from '@/components/DataTable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import CreateTrainingDialog from './CreateTrainingDialog';
import DeleteTrainingDialog from './DeleteTrainingDialog';
import { addDocument, updateDocument } from '@/hooks/firestore/firestore-utils';
import { toast } from 'sonner';

export interface Training {
  id: string;
  title: string;
  type: string;
  employeeId: string;
  employeeName: string;
  provider?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

type FilterStatus = 'all' | 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
type FilterType = 'all' | 'technical' | 'management' | 'soft_skills' | 'certification' | 'compliance' | 'other';

const trainingTypes = {
  technical: 'Technique',
  management: 'Management',
  soft_skills: 'Soft Skills',
  certification: 'Certification',
  compliance: 'Conformité',
  other: 'Autre'
};

const EmployeesTrainings: React.FC = () => {
  const module = {
    id: "employees-trainings",
    name: "Formations",
    href: "/modules/employees/trainings",
    icon: <GraduationCap className="h-5 w-5" />
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  
  const { data: trainings, isLoading, error } = useCollectionData<Training>(COLLECTIONS.HR.TRAININGS);
  const { employees } = useEmployeeData();
  
  useEffect(() => {
    if (!trainings) return;
    
    const filtered = trainings.filter(training => {
      const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (training.provider && training.provider.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
      const matchesType = typeFilter === 'all' || training.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredTrainings(filtered);
  }, [trainings, searchTerm, statusFilter, typeFilter]);
  
  const handleCreateTraining = () => {
    setCreateDialogOpen(true);
  };
  
  const handleEditStatus = async (training: Training, newStatus: string) => {
    try {
      await updateDocument(COLLECTIONS.HR.TRAININGS, training.id, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Statut mis à jour avec succès`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };
  
  const handleDeleteClick = (training: Training) => {
    setSelectedTraining(training);
    setDeleteDialogOpen(true);
  };
  
  const getFormattedDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return <StatusBadge status={status} />;
      case 'En cours':
        return <StatusBadge status={status} />;
      case 'Terminée':
        return <StatusBadge status={status} />;
      case 'Annulée':
        return <StatusBadge status={status} />;
      default:
        return <StatusBadge status={status} />;
    }
  };
  
  const renderTrainingType = (type: string) => {
    return trainingTypes[type as keyof typeof trainingTypes] || type;
  };
  
  const columns = [
    {
      key: 'employee',
      header: 'Employé',
      cell: (row: Training) => row.employeeName,
    },
    {
      key: 'title',
      header: 'Formation',
      cell: (row: Training) => row.title,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row: Training) => renderTrainingType(row.type),
    },
    {
      key: 'dates',
      header: 'Dates',
      cell: (row: Training) => (
        <div>
          <div>Début: {getFormattedDate(row.startDate)}</div>
          {row.endDate && <div>Fin: {getFormattedDate(row.endDate)}</div>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row: Training) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row: Training) => (
        <div className="flex items-center gap-2">
          <Select
            value={row.status}
            onValueChange={(value) => handleEditStatus(row, value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planifiée">Planifiée</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminée">Terminée</SelectItem>
              <SelectItem value="Annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  if (error) {
    return <div>Erreur lors du chargement des formations: {error.message}</div>;
  }
  
  return (
    <div className="space-y-6">
      <SubmoduleHeader
        title="Formations"
        description="Gérez les formations de vos employés"
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des formations</CardTitle>
          <Button onClick={handleCreateTraining}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une formation
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as FilterStatus)}
              >
                <SelectTrigger className="w-[140px]">
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
              
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as FilterType)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="technical">Technique</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="soft_skills">Soft Skills</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="compliance">Conformité</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DataTable
            columns={columns}
            data={filteredTrainings}
            loading={isLoading}
            noDataMessage="Aucune formation trouvée"
          />
        </CardContent>
      </Card>
      
      <CreateTrainingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={() => setCreateDialogOpen(false)}
        employees={employees as Employee[]}
      />
      
      <DeleteTrainingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => setDeleteDialogOpen(false)}
        training={selectedTraining}
      />
    </div>
  );
};

export default EmployeesTrainings;
