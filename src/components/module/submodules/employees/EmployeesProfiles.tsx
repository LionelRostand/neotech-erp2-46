
import React, { useState, useEffect } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getEmployeeFullName, filterEmployees, formatDateFR } from '../employees/utils/employeeUtils';
import { Column } from '@/types/table-types';
import { Department } from '../departments/types';
import EmployeeViewDialog from './EmployeeViewDialog';
import { toast } from 'sonner';

// Import your employee form component
import EmployeeForm from './EmployeeForm';

/**
 * Component for displaying and managing employee profiles
 */
const EmployeesProfiles = () => {
  // State definitions
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  // Use our centralized hook to get employee and department data
  const { employees, departments, isLoading, error } = useEmployeeData();

  // Apply filters whenever the source data or filters change
  useEffect(() => {
    // Make sure employees is an array before filtering
    if (Array.isArray(employees)) {
      const filtered = filterEmployees(
        employees,
        searchTerm,
        { status: statusFilter, department: departmentFilter }
      );
      setFilteredEmployees(filtered || []);
    } else {
      // If employees is not an array, set filtered to empty array
      setFilteredEmployees([]);
    }
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  // Get department name from ID
  const getDepartmentName = (departmentId: string): string => {
    if (!departments || !Array.isArray(departments)) return 'Inconnu';
    
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Inconnu';
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartmentFilter(newDepartment);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleAddEmployee = (newEmployee: Partial<Employee>) => {
    console.log('Adding new employee:', newEmployee);
    toast.success('Employé ajouté avec succès.');
    setIsAddDialogOpen(false);
  };

  const handleUpdateEmployee = (updatedEmployee: Partial<Employee>) => {
    console.log('Updating employee:', updatedEmployee);
    toast.success('Employé mis à jour avec succès.');
    setIsEditDialogOpen(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  // Employee table columns configuration - these define how the data is displayed
  const columns: Column<Employee>[] = [
    {
      header: 'Employé',
      accessorKey: 'name',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </div>
            </Avatar>
            <div>
              <div className="font-medium">{getEmployeeFullName(employee)}</div>
              <div className="text-sm text-muted-foreground">{employee.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
    {
      header: 'Département',
      accessorKey: 'department',
      cell: ({ row }) => {
        const departmentId = row.original.department || row.original.departmentId;
        return <div>{getDepartmentName(departmentId || '')}</div>;
      },
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status || 'inactive';
        let statusType: 'success' | 'warning' | 'danger' = 'danger';
        let label = 'Inactif';

        if (status === 'active' || status === 'Actif') {
          statusType = 'success';
          label = 'Actif';
        } else if (status === 'onLeave' || status === 'En congé') {
          statusType = 'warning';
          label = 'En congé';
        }

        return <StatusBadge status={statusType}>{label}</StatusBadge>;
      },
    },
    {
      header: 'Date d\'embauche',
      accessorKey: 'hireDate',
      cell: ({ row }) => {
        const date = row.original.hireDate || row.original.startDate || '';
        return <div>{formatDateFR(date)}</div>;
      },
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleEditEmployee(row.original);
            }}
          >
            Modifier
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewEmployee(row.original);
            }}
          >
            Voir
          </Button>
        </div>
      ),
    },
  ];

  // Safely handle employees data for the table
  const safeEmployees = filteredEmployees || [];
  
  // Status options for the filter
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'onLeave', label: 'En congé' },
  ];

  // If departments isn't defined or not an array, use an empty array instead
  const departmentOptions = !departments || !Array.isArray(departments) 
    ? []
    : [
        { value: '', label: 'Tous les départements' },
        ...departments.map(dept => ({
          value: dept.id || '',
          label: dept.name || 'Sans nom'
        }))
      ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Employés</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      {/* Search and filter section */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statut</SelectLabel>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Département</SelectLabel>
                  {departmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Employee table */}
      <DataTable
        columns={columns}
        data={safeEmployees}
        isLoading={isLoading}
        emptyMessage="Aucun employé trouvé"
        onRowClick={handleViewEmployee}
      />

      {/* View employee dialog */}
      {selectedEmployee && (
        <EmployeeViewDialog 
          open={isViewDialogOpen} 
          onOpenChange={setIsViewDialogOpen}
          employee={selectedEmployee}
          onEdit={() => {
            setIsViewDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
        />
      )}

      {/* Add employee form */}
      <EmployeeForm 
        onSubmit={handleAddEmployee} 
      />

      {/* Edit employee form */}
      {selectedEmployee && (
        <EmployeeForm
          onSubmit={handleUpdateEmployee}
          employee={selectedEmployee}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
