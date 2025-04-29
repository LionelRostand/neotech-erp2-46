import React, { useState, useMemo } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import { filterEmployees } from '@/components/module/submodules/employees/utils/employeeUtils';
import EmployeeViewDialog from './EmployeeViewDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';

interface EmployeesProfilesProps {
  // Add any props here
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ /* props */ }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { employees, departments, isLoading, error } = useEmployeeData();
  
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, searchTerm, { 
      status: statusFilter || undefined,
      department: departmentFilter || undefined
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);
  
  const columns = useMemo(() => [
    {
      accessorKey: "firstName",
      header: "Prénom",
      cell: ({ row }) => row.original.firstName,
    },
    {
      accessorKey: "lastName",
      header: "Nom",
      cell: ({ row }) => row.original.lastName,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "position",
      header: "Poste",
      cell: ({ row }) => row.original.position,
    },
    {
      accessorKey: "department",
      header: "Département",
      cell: ({ row }) => row.original.department,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status || 'inactive'}>
          {row.original.status || 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(row.original)}>
            Voir
          </Button>
        </div>
      ),
    },
  ], []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
  };
  
  const handleDepartmentFilter = (department: string | null) => {
    setDepartmentFilter(department);
  };
  
  const clearFilters = () => {
    setStatusFilter(null);
    setDepartmentFilter(null);
    setSearchTerm('');
  };
  
  if (isLoading) {
    return <div>Chargement des employés...</div>;
  }
  
  if (error) {
    return <div>Erreur lors du chargement des employés: {error.message}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Card>
          <CardHeader>
            <CardTitle>Liste des employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="md:w-80"
              />
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                      Actif
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter('inactive')}>
                      Inactif
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter('onLeave')}>
                      En congé
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDepartmentFilter('Marketing')}>
                      Marketing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDepartmentFilter('Ventes')}>
                      Ventes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDepartmentFilter('RH')}>
                      RH
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDepartmentFilter('Finance')}>
                      Finance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>
      
      <DataTable columns={columns} data={filteredEmployees} />
      
      {selectedEmployee && (
        <EmployeeViewDialog 
          open={true}
          onOpenChange={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
        />
      )}
      
      <CreateEmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default EmployeesProfiles;
