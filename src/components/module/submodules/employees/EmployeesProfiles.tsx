
import React, { useState } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import SubmoduleHeader from '../SubmoduleHeader';
import EmployeesTable from './EmployeesTable';
import EmployeeViewDialog from './dialogs/EmployeeViewDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Plus } from 'lucide-react';
import EmployeesDashboardCards from './dashboard/EmployeesDashboardCards';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const EmployeesProfiles: React.FC<{ employees?: Employee[], isLoading?: boolean }> = ({
  employees: propEmployees,
  isLoading: propIsLoading
}) => {
  const { employees: hookEmployees, isLoading: hookIsLoading } = useEmployeeData();
  const { createEmployee, updateEmployee, deleteEmployee, isDeleting } = useEmployeeActions();
  
  // Use either the props or the hook data
  const employees = propEmployees || hookEmployees || [];
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  
  // Filtered employees based on search
  const filteredEmployees = React.useMemo(() => {
    if (!searchTerm) return employees;
    
    const term = searchTerm.toLowerCase();
    return employees.filter(employee => {
      return (
        (employee?.firstName?.toLowerCase() || '').includes(term) ||
        (employee?.lastName?.toLowerCase() || '').includes(term) ||
        (employee?.email?.toLowerCase() || '').includes(term) ||
        (employee?.position?.toLowerCase() || '').includes(term) ||
        (employee?.phone?.toLowerCase() || '').includes(term)
      );
    });
  }, [employees, searchTerm]);
  
  // Handler for creating a new employee
  const handleCreateEmployee = async (employee: Partial<Employee>) => {
    const result = await createEmployee(employee as Omit<Employee, 'id'>);
    if (result) {
      setIsCreateDialogOpen(false);
    }
  };
  
  // Handler for updating an employee
  const handleUpdateEmployee = async (employee: Partial<Employee>) => {
    if (!employee.id) {
      toast.error("ID d'employé manquant");
      return;
    }
    
    const result = await updateEmployee(employee);
    if (result) {
      setViewEmployee(null);
    }
  };
  
  // Handler for deleting an employee
  const handleConfirmDelete = async () => {
    if (!employeeToDelete?.id) return;
    
    const result = await deleteEmployee(employeeToDelete.id);
    if (result) {
      setEmployeeToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };
  
  // Handler for exporting employee data
  const handleExport = () => {
    toast.info("Fonctionnalité d'exportation en cours de développement");
  };
  
  return (
    <div className="container mx-auto py-4 space-y-6">
      <SubmoduleHeader 
        title="Fiches Employés" 
        description="Gérez les fiches des employés de votre entreprise" 
      />
      
      {/* Dashboard Cards */}
      <EmployeesDashboardCards />
      
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un employé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="whitespace-nowrap"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Employé
          </Button>
        </div>
      </div>
      
      {/* Employees Table */}
      <EmployeesTable 
        employees={filteredEmployees} 
        isLoading={isLoading}
        onView={(employee) => setViewEmployee(employee)}
        onEdit={(employee) => setViewEmployee(employee)}
        onDelete={(employee) => {
          setEmployeeToDelete(employee);
          setDeleteConfirmOpen(true);
        }}
      />
      
      {/* Employee View Dialog */}
      {viewEmployee && (
        <EmployeeViewDialog
          employee={viewEmployee}
          open={!!viewEmployee}
          onOpenChange={() => setViewEmployee(null)}
          onUpdate={handleUpdateEmployee}
        />
      )}
      
      {/* Create Employee Dialog */}
      <CreateEmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateEmployee}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesProfiles;
