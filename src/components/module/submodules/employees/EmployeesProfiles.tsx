
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  UserPlus
} from 'lucide-react';
import { Employee } from '@/types/employee';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeeViewDialog from './EmployeeViewDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeeForm from './EmployeeForm';
import EmployeeStats from './EmployeesStats';
import { toast } from 'sonner';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';

interface EmployeesProfilesProps {
  employees?: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ 
  employees = [], 
  isLoading = false 
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Hooks
  const { addEmployee, updateEmployee, isLoading: isActionLoading } = useEmployeeActions();

  // Filter employees when search query or employees list changes
  useEffect(() => {
    if (!employees || employees.length === 0) {
      setFilteredEmployees([]);
      return;
    }

    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = employees.filter(employee => {
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
      const position = (employee.position || '').toLowerCase();
      const department = (employee.department || '').toLowerCase();
      
      return (
        fullName.includes(query) ||
        position.includes(query) ||
        department.includes(query)
      );
    });
    
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  // Handle adding a new employee
  const handleAddEmployee = async (newEmployee: Partial<Employee>) => {
    try {
      await addEmployee(newEmployee);
      setIsAddDialogOpen(false);
      toast.success('Employé ajouté avec succès');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error(`Erreur lors de l'ajout de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Handle updating an employee
  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    if (!selectedEmployee?.id) return;
    
    try {
      await updateEmployee({ ...updatedEmployee, id: selectedEmployee.id });
      setIsEditDialogOpen(false);
      toast.success('Employé mis à jour avec succès');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Handle opening edit dialog
  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  // Handle opening delete dialog
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  // Handle opening view dialog
  const handleViewClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <EmployeeStats employees={employees} />
      
      {/* Search and Add Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un employé..."
            className="w-full sm:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>
      
      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun employé trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.employeeId || employee.id?.substring(0, 5) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {employee.photoURL && (
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={employee.photoURL} 
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div>{employee.firstName} {employee.lastName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position || 'Non spécifié'}</TableCell>
                    <TableCell>{employee.department || 'Non spécifié'}</TableCell>
                    <TableCell>{employee.phone || 'Non spécifié'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewClick(employee)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(employee)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(employee)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isActionLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier l'employé</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={selectedEmployee || undefined}
            onSubmit={handleUpdateEmployee}
            onCancel={() => setIsEditDialogOpen(false)}
            isSubmitting={isActionLoading}
            isEditing
          />
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      {selectedEmployee && (
        <EmployeeViewDialog
          employee={selectedEmployee}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          onUpdate={handleUpdateEmployee}
        />
      )}

      {/* Delete Employee Dialog */}
      <EmployeeDeleteDialog
        employee={selectedEmployee}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={() => {
          toast.success('Employé supprimé avec succès');
        }}
      />
    </div>
  );
};

export default EmployeesProfiles;
