
import React, { useState } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { Button } from "@/components/ui/button";
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Column } from '@/types/table-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import EmployeesStats from './EmployeesStats';
import EmployeeViewDialog from './EmployeeViewDialog';
import { toast } from 'sonner';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import CreateEmployeeDialog from './CreateEmployeeDialog';

const EmployeesProfiles: React.FC<{ employees: Employee[], isLoading?: boolean }> = ({ 
  employees = [], 
  isLoading = false 
}) => {
  const { updateEmployee, deleteEmployee } = useEmployeeActions();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };

  const handleUpdateEmployee = async (data: Partial<Employee>) => {
    if (!data.id) return;

    try {
      await updateEmployee(data);
      // Update the selected employee in state to see changes immediately
      if (selectedEmployee && selectedEmployee.id === data.id) {
        setSelectedEmployee(prev => prev ? { ...prev, ...data } : prev);
      }
      toast.success('Employé mis à jour avec succès');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour de l\'employé');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await deleteEmployee(id);
        toast.success('Employé supprimé avec succès');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Erreur lors de la suppression de l\'employé');
      }
    }
  };

  const handleAddEmployee = () => {
    setCreateDialogOpen(true);
  };

  const handleEmployeeCreated = (employee: Employee) => {
    toast.success(`L'employé ${employee.firstName} ${employee.lastName} a été créé avec succès`);
    // No need to refresh the data here as it's managed by useEmployeeData hook
  };

  const columns: Column<Employee>[] = [
    {
      header: "Nom",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 h-8 w-8">
            {row.original.photoUrl ? (
              <img
                src={row.original.photoUrl}
                alt={`${row.original.firstName} ${row.original.lastName}`}
                className="rounded-full object-cover h-full w-full"
              />
            ) : (
              <div className="bg-gray-200 rounded-full h-full w-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {row.original.firstName?.[0]}{row.original.lastName?.[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{row.original.firstName} {row.original.lastName}</div>
            <div className="text-sm text-gray-500">{row.original.position}</div>
          </div>
        </div>
      )
    },
    {
      header: "Département",
      accessorKey: "department",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Date d'embauche",
      cell: ({ row }) => row.original.hireDate ? formatDate(row.original.hireDate) : "-"
    },
    {
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status || '';
        return <StatusBadge status={status} />;
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleViewEmployee(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEmployee(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employés</h1>
          <Button onClick={handleAddEmployee}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>
        
        <EmployeesStats employees={employees} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Liste des employés</h2>
        
        <DataTable
          columns={columns}
          data={employees}
          isLoading={isLoading}
          emptyMessage="Aucun employé trouvé"
        />
      </div>

      <EmployeeViewDialog
        employee={selectedEmployee}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onUpdate={handleUpdateEmployee}
      />

      <CreateEmployeeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={handleEmployeeCreated}
      />
    </div>
  );
};

export default EmployeesProfiles;
