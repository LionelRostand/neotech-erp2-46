
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Employee } from '@/types/employee';
import EmployeeTable from './EmployeeTable';
import EmployeeFilter from './EmployeeFilter';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import ImportEmployeesDialog from './ImportEmployeesDialog';
import { usePermissions } from '@/hooks/usePermissions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmployeesProfilesProps {
  employeesProp?: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employeesProp }) => {
  const { employees: dataEmployees, departments, refetchEmployees } = useHrModuleData();
  
  // Prioritize prop employees if provided, otherwise use the ones from useHrModuleData
  const allEmployees = employeesProp || dataEmployees;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(allEmployees);
  const navigate = useNavigate();
  const { isAdmin, checkPermission } = usePermissions('employees-profiles');
  const [canCreate, setCanCreate] = useState(false);
  
  useEffect(() => {
    // Check if user has permission to create employees
    const checkCreatePermission = async () => {
      const hasPermission = await checkPermission('employees-profiles', 'create');
      setCanCreate(hasPermission || isAdmin);
    };
    
    checkCreatePermission();
  }, [checkPermission, isAdmin]);
  
  // Filter employees based on search term, department, and status
  useEffect(() => {
    let filtered = [...allEmployees];
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        employee => 
          employee.firstName?.toLowerCase().includes(lowerSearchTerm) || 
          employee.lastName?.toLowerCase().includes(lowerSearchTerm) ||
          employee.email?.toLowerCase().includes(lowerSearchTerm) ||
          employee.position?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Filter by department
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(
        employee => employee.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        employee => employee.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredEmployees(filtered);
  }, [allEmployees, searchTerm, departmentFilter, statusFilter]);
  
  const handleEmployeeClick = (employee: Employee) => {
    navigate(`/modules/employees/profiles/${employee.id}`);
  };
  
  const handleCreateEmployee = async (employeeData: Partial<Employee>) => {
    try {
      // Here, you would typically call a service to create the employee
      // For now, we'll just close the dialog and show a success message
      setShowCreateDialog(false);
      toast.success('Employé créé avec succès');
      
      // Refresh the employees list
      await refetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };
  
  const handleImportEmployees = async (employees: Partial<Employee>[]) => {
    try {
      // Here, you would typically call a service to import the employees
      setShowImportDialog(false);
      toast.success(`${employees.length} employés importés avec succès`);
      
      // Refresh the employees list
      await refetchEmployees();
    } catch (error) {
      console.error('Error importing employees:', error);
      toast.error("Erreur lors de l'importation des employés");
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Employés</h1>
        
        <div className="flex flex-wrap gap-2">
          {canCreate && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowImportDialog(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importer
              </Button>
              
              <Button
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvel employé
              </Button>
            </>
          )}
        </div>
      </div>
      
      <EmployeeFilter
        onDepartmentChange={setDepartmentFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchTerm}
        onImportClick={canCreate ? () => setShowImportDialog(true) : undefined}
      />
      
      <EmployeeTable 
        employees={filteredEmployees}
        onEmployeeClick={handleEmployeeClick}
      />
      
      {showCreateDialog && (
        <CreateEmployeeDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onEmployeeCreated={handleCreateEmployee}
        />
      )}
      
      {showImportDialog && (
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Importer des employés</DialogTitle>
            </DialogHeader>
            
            <ImportEmployeesDialog onImport={handleImportEmployees} />
            
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesProfiles;
