import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeViewDialog from './EmployeeViewDialog';
import { cn } from '@/lib/utils';
import EmployeeForm from './EmployeeForm';
import { EmployeeFormValues } from './form/employeeFormSchema';
import { StatusBadge } from '@/components/ui/status-badge';
import { getDepartmentName } from './utils/departmentUtils';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ 
  employees = [],
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { departments } = useAvailableDepartments();
  
  useEffect(() => {
    if (employees && Array.isArray(employees)) {
      const filtered = employees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [searchQuery, employees]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleOpenDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
  };
  
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleEmployeeUpdate = (updatedEmployee: Partial<Employee>) => {
    // Optimistically update the employee in the list
    const updatedEmployees = employees.map(emp =>
      emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
    );
    setFilteredEmployees(updatedEmployees);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employés</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            value={searchQuery}
            onChange={handleSearch}
            className="md:w-[300px]"
          />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un employé</DialogTitle>
              </DialogHeader>
              <EmployeeForm onCancel={handleCloseForm} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-24" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </CardFooter>
              </Card>
            ))}
          </>
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <CardTitle>{employee.firstName} {employee.lastName}</CardTitle>
                <CardDescription>
                  {employee.position}
                  {employee.status && (
                    <StatusBadge status={employee.status} className="ml-2">{employee.status}</StatusBadge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <Badge variant="secondary">
                    {getDepartmentName(employee.departmentId, departments)}
                  </Badge>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p>
                  {employee.professionalEmail}
                </p>
                <Button variant="secondary" size="sm" onClick={() => handleOpenDialog(employee)}>
                  Voir
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center">
            Aucun employé trouvé.
          </div>
        )}
      </div>
      
      {selectedEmployee && (
        <EmployeeViewDialog
          employee={selectedEmployee}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onUpdate={handleEmployeeUpdate}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
