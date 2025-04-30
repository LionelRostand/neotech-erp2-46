
import React, { useState } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from '@/components/ui/button';
import { Plus, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StatCard from '@/components/StatCard';
import { Users, Building2, UserCheck } from 'lucide-react';
import EmployeesTable from './EmployeesTable';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import ViewEmployeeDialog from './ViewEmployeeDialog';
import EditEmployeeDialog from './dialogs/EmployeeEditDialog';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';
import { Employee } from '@/types/employee';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';

const EmployeesDashboard = () => {
  const { employees = [], departments = [], isLoading } = useEmployeeData();
  const { createEmployee, deleteEmployee } = useEmployeeActions();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog control states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading2, setIsLoading2] = useState(false);
  
  // Calculate statistics
  const totalEmployees = employees.length;
  const activeDepartments = departments.length;
  const activeEmployees = employees.filter(emp => 
    emp.status === 'active' || emp.status === 'Actif'
  ).length;
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower) ||
      employee.position?.toLowerCase().includes(searchLower) ||
      employee.department?.toLowerCase().includes(searchLower)
    );
  });
  
  // Handle employee creation
  const handleCreateEmployee = async (data: Partial<Employee>) => {
    try {
      await createEmployee(data as Omit<Employee, 'id'>);
      setCreateDialogOpen(false);
      toast.success("Employé créé avec succès");
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };
  
  // Handle employee deletion
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee?.id) return;
    
    setIsLoading2(true);
    try {
      await deleteEmployee(selectedEmployee.id);
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast.success("Employé supprimé avec succès");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setIsLoading2(false);
    }
  };
  
  // View employee details
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };
  
  // Edit employee
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };
  
  // Delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Employés</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Employés totaux"
          value={totalEmployees.toString()}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Effectif total de l'entreprise"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        
        <StatCard
          title="Départements actifs"
          value={activeDepartments.toString()}
          icon={<Building2 className="h-6 w-6 text-purple-600" />}
          description="Départements avec employés"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        
        <StatCard
          title="Employés actifs"
          value={activeEmployees.toString()}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          description="Employés en activité"
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Rechercher un employé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Employé
          </Button>
        </div>
      </div>
      
      {/* Employees Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Liste des employés</h2>
        <EmployeesTable
          employees={filteredEmployees}
          onView={handleViewEmployee}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          isLoading={isLoading}
        />
      </div>
      
      {/* Dialogs */}
      <CreateEmployeeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateEmployee}
      />
      
      {selectedEmployee && (
        <>
          <ViewEmployeeDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            employee={selectedEmployee}
          />
          
          <EditEmployeeDialog
            employee={selectedEmployee}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          
          <DeleteConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            title="Supprimer l'employé"
            description={`Êtes-vous sûr de vouloir supprimer l'employé ${selectedEmployee.firstName} ${selectedEmployee.lastName} ? Cette action est irréversible.`}
            isLoading={isLoading2}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesDashboard;
