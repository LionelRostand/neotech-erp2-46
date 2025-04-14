import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import StatusBadge from '@/components/module/submodules/StatusBadge';
import { useTrainingsData, Training } from '@/hooks/useTrainingsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import CreateTrainingDialog from './CreateTrainingDialog';
import { toast } from 'sonner';
import SubmoduleHeader from '../SubmoduleHeader';
import { format } from 'date-fns';

const EmployeesTrainings: React.FC = () => {
  const { trainings, isLoading, error } = useTrainingsData();
  const { employees } = useEmployeeData();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Données actualisées');
    }, 500);
  };
  
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
  };
  
  const handleTrainingCreated = () => {
    setOpenCreateDialog(false);
    handleRefresh();
    toast.success('Formation créée avec succès');
  };

  const columns = [
    {
      key: 'title',
      header: 'Titre',
      cell: ({ row }: { row: { original: Training } }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: ({ row }: { row: { original: Training } }) => (
        <div>{getTrainingTypeLabel(row.original.type)}</div>
      ),
    },
    {
      key: 'employee',
      header: 'Employé',
      cell: ({ row }: { row: { original: Training } }) => (
        <div className="flex items-center gap-2">
          {row.original.employeePhoto ? (
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img 
                src={row.original.employeePhoto} 
                alt={row.original.employeeName} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              {getInitials(row.original.employeeName || '')}
            </div>
          )}
          <span>{row.original.employeeName}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Département',
      cell: ({ row }: { row: { original: Training } }) => (
        <div>{row.original.department}</div>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      cell: ({ row }: { row: { original: Training } }) => (
        <div>
          <div>{row.original.startDate}</div>
          {row.original.endDate && <div className="text-xs text-gray-500">au {row.original.endDate}</div>}
        </div>
      ),
    },
    {
      key: 'provider',
      header: 'Organisme',
      cell: ({ row }: { row: { original: Training } }) => (
        <div>{row.original.provider || '-'}</div>
      ),
    },
    {
      key: 'location',
      header: 'Lieu',
      cell: ({ row }: { row: { original: Training } }) => (
        <div>{row.original.location || '-'}</div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }: { row: { original: Training } }) => (
        <StatusBadge status={row.original.status}>
          {row.original.status}
        </StatusBadge>
      ),
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getTrainingTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'technical': 'Technique',
      'management': 'Management',
      'soft_skills': 'Soft Skills',
      'certification': 'Certification',
      'compliance': 'Conformité',
      'other': 'Autre',
    };
    
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Formations</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-xs text-green-800 font-medium mb-1">Planifiées</div>
              <div className="text-2xl font-bold text-green-700">
                {isLoading ? '-' : trainings.filter(t => t.status === 'Planifiée').length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-xs text-yellow-800 font-medium mb-1">En cours</div>
              <div className="text-2xl font-bold text-yellow-700">
                {isLoading ? '-' : trainings.filter(t => t.status === 'En cours').length}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-800 font-medium mb-1">Terminées</div>
              <div className="text-2xl font-bold text-blue-700">
                {isLoading ? '-' : trainings.filter(t => t.status === 'Terminée').length}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-xs text-red-800 font-medium mb-1">Annulées</div>
              <div className="text-2xl font-bold text-red-700">
                {isLoading ? '-' : trainings.filter(t => t.status === 'Annulée').length}
              </div>
            </div>
          </div>
          
          <DataTable 
            columns={columns}
            data={trainings}
            isLoading={isLoading}
            emptyMessage="Aucune formation trouvée"
          />
        </CardContent>
      </Card>

      <CreateTrainingDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog}
        onClose={handleCloseDialog}
        onSubmit={handleTrainingCreated}
        employees={employees || []}
      />
    </div>
  );
};

export default EmployeesTrainings;
