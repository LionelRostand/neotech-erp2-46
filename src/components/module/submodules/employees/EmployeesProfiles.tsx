import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table-types';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useAddEmployee } from '@/hooks/useAddEmployee';
import { PlusIcon, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/module/submodules/StatusBadge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeViewDialog from './EmployeeViewDialog';
import { capitalize } from '@/lib/utils';
import EmployeeForm from './EmployeeForm';
import { EmployeeFormValues } from './form/employeeFormSchema';
import { formValuesToEmployee } from './utils/formAdapter';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getDepartmentName } from './utils/departmentUtils';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees, isLoading }) => {
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { updateEmployee, deleteEmployee } = useEmployeeActions();
  const { addEmployee } = useAddEmployee();
  const { addDocument } = useFirestore();

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    const filtered = employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

    setFilteredEmployees(filtered);
  };

  const handleCreateEmployee = async (data: EmployeeFormValues) => {
    try {
      const employeeData = formValuesToEmployee(data);
      if (employeeData) {
        const newEmployeeId = await addDocument(COLLECTIONS.EMPLOYEES, employeeData);
        if (newEmployeeId) {
          toast.success('Employé créé avec succès !');
          setIsCreateDialogOpen(false);
        } else {
          toast.error('Erreur lors de la création de l\'employé.');
        }
      } else {
        toast.error('Erreur de conversion des données.');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Erreur lors de la création de l\'employé.');
    }
  };

  const handleUpdateEmployee = async (employeeId: string, data: Partial<Employee>) => {
    try {
      await updateEmployee({ id: employeeId, ...data });
      toast.success('Employé mis à jour avec succès !');
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour de l\'employé.');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
      toast.success('Employé supprimé avec succès !');
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Erreur lors de la suppression de l\'employé.');
    }
  };

  const columns: Column<Employee>[] = useMemo(() => [
    {
      accessorKey: 'photoURL',
      header: 'Photo',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.photoURL} alt={`${row.firstName} ${row.lastName}`} />
          <AvatarFallback>{`${row.firstName[0]}${row.lastName[0]}`}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'Prénom',
      cell: ({ row }) => capitalize(row.firstName),
    },
    {
      accessorKey: 'lastName',
      header: 'Nom',
      cell: ({ row }) => capitalize(row.lastName),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
    },
    {
      accessorKey: 'department',
      header: 'Département',
      cell: ({ row }) => getDepartmentName(row.department, [])
    },
    {
      accessorKey: 'position',
      header: 'Poste',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <StatusBadge status={row.status || 'active'} />,
    },
  ], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Card className="flex items-center p-2 w-full max-w-sm">
          <Search className="h-4 w-4 mr-2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            value={search}
            onChange={handleSearch}
            className="border-none shadow-none focus-visible:ring-0"
          />
        </Card>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      {isLoading ? (
        <div className="w-full overflow-hidden rounded-md border border-gray-200">
          <div className="overflow-x-auto">
            <div className="w-full min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50 px-6 py-3">
                {columns.map((column, idx) => (
                  <Skeleton key={idx} className="h-4 w-24 my-2" />
                ))}
              </div>
              <div className="divide-y divide-gray-200 bg-white">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="px-6 py-4">
                    {columns.map((_, colIndex) => (
                      <Skeleton key={colIndex} className="h-4 w-full my-2" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredEmployees}
          emptyMessage="Aucun employé trouvé."
          onRowClick={(employee) => {
            setSelectedEmployee(employee);
            setIsViewDialogOpen(true);
          }}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un employé</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleCreateEmployee}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <EmployeeViewDialog
        employee={selectedEmployee as Employee}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onUpdate={(data) => {
          if (selectedEmployee) {
            handleUpdateEmployee(selectedEmployee.id, data);
          }
        }}
      />
    </div>
  );
};

export default EmployeesProfiles;
