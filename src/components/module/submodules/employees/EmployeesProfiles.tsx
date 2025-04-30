
import React, { useState } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import ViewEmployeeDialog from './ViewEmployeeDialog';
import EditEmployeeDialog from './EditEmployeeDialog';
import EmployeesStats from './EmployeesStats';
import DeleteEmployeeDialog from './DeleteEmployeeDialog';
import { Column } from '@/types/table-types';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ 
  employees = [], 
  isLoading = false 
}) => {
  const { departments } = useEmployeeData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { createEmployee, updateEmployee, deleteEmployee } = useEmployeeActions();

  const handleCreateEmployee = async (newEmployee: Partial<Employee>) => {
    try {
      await createEmployee(newEmployee as Omit<Employee, 'id'>);
      setIsCreateDialogOpen(false);
      toast.success('Employé créé avec succès');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Erreur lors de la création de l\'employé');
    }
  };

  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    if (!selectedEmployee?.id) return;
    
    try {
      await updateEmployee({
        ...updatedEmployee,
        id: selectedEmployee.id
      });
      setIsEditDialogOpen(false);
      toast.success('Employé mis à jour avec succès');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour de l\'employé');
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee?.id) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      toast.success('Employé supprimé avec succès');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Erreur lors de la suppression de l\'employé');
    }
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Photo',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
            {row.original.photoURL || row.original.photo ? (
              <img
                src={row.original.photoURL || row.original.photo}
                alt={`${row.original.firstName} ${row.original.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                {row.original.firstName?.[0]}{row.original.lastName?.[0]}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Nom',
      accessorKey: 'lastName',
    },
    {
      header: 'Prénom',
      accessorKey: 'firstName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Poste',
      accessorKey: 'position',
    },
    {
      header: 'Département',
      cell: ({ row }) => {
        const deptId = row.original.department || row.original.departmentId;
        const department = departments?.find(d => d.id === deptId);
        return department ? department.name : deptId || '-';
      },
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusClass = "px-2 py-1 text-xs rounded-full";
        
        switch(status) {
          case 'active':
          case 'Actif':
            statusClass += " bg-green-100 text-green-800";
            return <span className={statusClass}>Actif</span>;
          case 'inactive':
          case 'Inactif':
            statusClass += " bg-gray-100 text-gray-800";
            return <span className={statusClass}>Inactif</span>;
          case 'onLeave':
          case 'En congé':
            statusClass += " bg-amber-100 text-amber-800";
            return <span className={statusClass}>En congé</span>;
          case 'Suspendu':
            statusClass += " bg-red-100 text-red-800";
            return <span className={statusClass}>Suspendu</span>;
          default:
            return <span className={statusClass}>{status}</span>;
        }
      },
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEmployee(row.original);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Voir</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEmployee(row.original);
              setIsEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Modifier</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-900 hover:bg-red-50"
            onClick={() => {
              setSelectedEmployee(row.original);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Stats et bouton d'ajout */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Employés</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Employé
            </Button>
          </div>
          
          {/* Statistiques des employés */}
          <EmployeesStats employees={employees} />
        </div>
        
        {/* Tableau des employés */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Liste des employés</h2>
          <DataTable
            columns={columns}
            data={employees}
            isLoading={isLoading}
            emptyMessage="Aucun employé trouvé"
          />
        </div>
      </div>
      
      {/* Dialogs */}
      <CreateEmployeeDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateEmployee}
      />
      
      {selectedEmployee && (
        <>
          <ViewEmployeeDialog 
            open={isViewDialogOpen} 
            onOpenChange={setIsViewDialogOpen}
            employee={selectedEmployee}
          />
          
          <EditEmployeeDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen}
            employee={selectedEmployee}
            onSubmit={handleUpdateEmployee}
          />
          
          <DeleteEmployeeDialog 
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            employee={selectedEmployee}
            onConfirm={handleDeleteEmployee}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesProfiles;
