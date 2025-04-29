import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Search, Plus } from 'lucide-react';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeeViewDialog from './EmployeeViewDialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { getDepartmentName } from './utils/departmentUtils';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { filterEmployees } from './utils/employeeUtils';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const results = filterEmployees(employees, query);
    setFilteredEmployees(results);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Rechercher un employé..."
            className="max-w-sm"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search className="ml-2 h-4 w-4 text-gray-500" />
        </div>
        <Button onClick={() => setOpenCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>
      <div className="py-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Chargement des employés...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucun employé trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={employee.photoURL} alt={employee.firstName} />
                          <AvatarFallback>{employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{employee.firstName} {employee.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.professionalEmail}</TableCell>
                    <TableCell>{getDepartmentName(employee.departmentId, useEmployeeData().departments)}</TableCell>
                    <TableCell>
                      <StatusBadge status={employee.status}>{employee.status}</StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <CreateEmployeeDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} />
      {selectedEmployee && (
        <EmployeeViewDialog
          open={openViewDialog}
          onOpenChange={setOpenViewDialog}
          employee={selectedEmployee}
          onClose={handleCloseViewDialog}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
