
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

const EmployeesProfiles: React.FC<{ employees: Employee[], isLoading?: boolean }> = ({ 
  employees = [], 
  isLoading = false 
}) => {
  const { updateEmployee, deleteEmployee } = useEmployeeActions();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Ensure employees is always a valid array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return dateStr || "-";
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

  const columns: Column<Employee>[] = [
    {
      header: "Nom",
      cell: ({ row }) => {
        const employee = row.original || {};
        return (
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 h-8 w-8">
              {employee.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  alt={`${employee.firstName || ''} ${employee.lastName || ''}`}
                  className="rounded-full object-cover h-full w-full"
                />
              ) : (
                <div className="bg-gray-200 rounded-full h-full w-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {(employee.firstName || '')[0]}{(employee.lastName || '')[0]}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{employee.firstName || ''} {employee.lastName || ''}</div>
              <div className="text-sm text-gray-500">{employee.position || ''}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: "Département",
      accessorKey: "department",
      cell: ({ row }) => row.original?.department || "-"
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => row.original?.email || "-"
    },
    {
      header: "Date d'embauche",
      cell: ({ row }) => row.original?.hireDate ? formatDate(row.original.hireDate) : "-"
    },
    {
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original?.status || '';
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
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>
        
        <EmployeesStats employees={safeEmployees} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Liste des employés</h2>
        
        <DataTable
          columns={columns}
          data={safeEmployees}
          isLoading={isLoading}
          emptyMessage="Aucun employé trouvé"
        />
      </div>

      {selectedEmployee && (
        <EmployeeViewDialog
          employee={selectedEmployee}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          onUpdate={handleUpdateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
