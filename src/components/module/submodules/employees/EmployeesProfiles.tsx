
import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import SubmoduleHeader from '../SubmoduleHeader';
import EmployeeFilter from './EmployeeFilter';
import EmployeeViewDialog from './dialogs/EmployeeViewDialog';
import EmployeeEditDialog from './dialogs/EmployeeEditDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';

const EmployeesProfiles = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const { updateEmployee } = useEmployeeActions();

  // Dialogs state
  const { 
    isOpen: isCreateDialogOpen, 
    onOpen: onCreateDialogOpen, 
    onClose: onCreateDialogClose 
  } = useDisclosure();
  
  const { 
    isOpen: isViewDialogOpen, 
    onOpen: onViewDialogOpen, 
    onClose: onViewDialogClose 
  } = useDisclosure();
  
  const { 
    isOpen: isEditDialogOpen, 
    onOpen: onEditDialogOpen, 
    onClose: onEditDialogClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteDialogOpen, 
    onOpen: onDeleteDialogOpen, 
    onClose: onDeleteDialogClose 
  } = useDisclosure();

  // Fetch employees data from hr_employees collection
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES || 'hr_employees');
        const snapshot = await getDocs(employeesRef);
        const employeesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[];
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Erreur lors du chargement des employés");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) ||
             (employee.department && employee.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // Handle view employee
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    onViewDialogOpen();
  };

  // Handle edit employee
  const handleEditEmployee = () => {
    onViewDialogClose();
    onEditDialogOpen();
  };

  // Handle update employee
  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    if (!selectedEmployee) return;

    try {
      await updateEmployee({
        ...updatedEmployee,
        id: selectedEmployee.id,
      });
      
      // Update the local state to reflect changes
      setEmployees(prevEmployees => prevEmployees.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, ...updatedEmployee } : emp
      ));
      
      setSelectedEmployee(prev => prev ? { ...prev, ...updatedEmployee } : null);
      onEditDialogClose();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Handle delete employee
  const handleDeleteClick = () => {
    onViewDialogClose();
    onDeleteDialogOpen();
  };

  // Handle create employee submission
  const handleCreateEmployee = async (newEmployee: Partial<Employee>) => {
    // The create functionality is handled in the CreateEmployeeDialog component
    onCreateDialogClose();
    // Refresh the data after creation
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES || 'hr_employees');
    const snapshot = await getDocs(employeesRef);
    const employeesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Employee[];
    setEmployees(employeesData);
    setFilteredEmployees(employeesData);
  };

  return (
    <div className="space-y-6 p-6">
      <SubmoduleHeader 
        title="Gestion des employés" 
        description="Consultez et gérez les informations des employés" 
      />
      
      <div className="flex items-center justify-between">
        <EmployeeFilter onFilterChange={setSearchTerm} />
        
        <Button onClick={onCreateDialogOpen} className="ml-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvel employé
        </Button>
      </div>
      
      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Chargement des données...</TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Aucun employé trouvé</TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow 
                  key={employee.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewEmployee(employee)}
                >
                  <TableCell className="font-mono text-xs">{employee.id?.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.position || "Non spécifié"}</TableCell>
                  <TableCell>{employee.department || "Non spécifié"}</TableCell>
                  <TableCell>{employee.phone || "Non spécifié"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewEmployee(employee);
                      }}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Employee Dialog */}
      <CreateEmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={onCreateDialogClose}
        onSuccess={handleCreateEmployee}
      />

      {/* View Employee Dialog */}
      <EmployeeViewDialog
        employee={selectedEmployee}
        open={isViewDialogOpen}
        onOpenChange={onViewDialogClose}
        onEdit={handleEditEmployee}
      />

      {/* Edit Employee Dialog */}
      <EmployeeEditDialog
        employee={selectedEmployee}
        open={isEditDialogOpen}
        onOpenChange={onEditDialogClose}
        onSuccess={() => {
          onEditDialogClose();
          // Refresh data after update
          const fetchEmployees = async () => {
            try {
              const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES || 'hr_employees');
              const snapshot = await getDocs(employeesRef);
              const employeesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as Employee[];
              setEmployees(employeesData);
              setFilteredEmployees(employeesData);
            } catch (error) {
              console.error("Error fetching employees:", error);
            }
          };
          fetchEmployees();
        }}
      />

      {/* Delete Employee Dialog */}
      <EmployeeDeleteDialog
        employee={selectedEmployee}
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogClose}
        onSuccess={() => {
          onDeleteDialogClose();
          onViewDialogClose();
          // Refresh data after delete
          const fetchEmployees = async () => {
            try {
              const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES || 'hr_employees');
              const snapshot = await getDocs(employeesRef);
              const employeesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as Employee[];
              setEmployees(employeesData);
              setFilteredEmployees(employeesData);
            } catch (error) {
              console.error("Error fetching employees:", error);
            }
          };
          fetchEmployees();
        }}
      />
    </div>
  );
};

export default EmployeesProfiles;
