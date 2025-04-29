
import React, { useState, useEffect } from 'react';
import { Employee, Department } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import useEmployeeActions from './hooks/useEmployeeActions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EmployeeViewDialog from './EmployeeViewDialog';
import EmployeeFormDialog from './EmployeeFormDialog';
import { getInitials } from '@/lib/utils';
import DeleteEmployeeDialog from './DeleteEmployeeDialog';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import EmployeesDashboardCards from './dashboard/EmployeesDashboardCards';
import { useEmployeeData as useEmployeeDataHook } from '@/hooks/useEmployeeData';

const EmployeesProfiles = () => {
  const { employees, departments, isLoading } = useEmployeeData();
  const { addEmployee, updateEmployee, deleteEmployee } = useEmployeeActions();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const firestore = useFirestore('employees');

  useEffect(() => {
    console.log('Employees loaded:', employees.length);
  }, [employees]);

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setAddDialogOpen(true);
  };

  const handleEditEmployee = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsDeleting(true);
      await deleteEmployee(selectedEmployee.id);
      setDeleteDialogOpen(false);
      toast.success(`L'employé ${selectedEmployee.firstName} ${selectedEmployee.lastName} a été supprimé`);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSubmit = async (newEmployee: Partial<Employee>) => {
    try {
      await addEmployee(newEmployee as Employee);
      setAddDialogOpen(false);
      toast.success("Employé ajouté avec succès");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Erreur lors de l'ajout de l'employé");
    }
  };

  const handleEditSubmit = async (updatedEmployee: Partial<Employee>) => {
    if (!selectedEmployee) return;
    
    try {
      await updateEmployee(selectedEmployee.id, updatedEmployee);
      setEditDialogOpen(false);
      toast.success("Employé mis à jour avec succès");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    }
  };

  // Use employees from the main hook for display
  const { employees: employeesForDashboard, departments: departmentsForDashboard, isLoading: loadingDashboard } = useEmployeeDataHook();

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Tableau de bord des employés</h1>
        <p className="text-muted-foreground">Statistiques et informations sur les employés de l'entreprise</p>
      </div>

      <EmployeesDashboardCards 
        employees={employeesForDashboard}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Gestion des employés</h2>
            <p className="text-muted-foreground">
              Consultez, ajoutez, modifiez ou supprimez des employés
            </p>
          </div>
          <Button onClick={handleAddEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Chargement des employés...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={employee.photo} />
                      <AvatarFallback>{getInitials(`${employee.firstName} ${employee.lastName}`)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-muted-foreground">{employee.position}</p>
                    {employee.company && (
                      <p className="text-sm text-muted-foreground">
                        {typeof employee.company === 'string' 
                          ? employee.company 
                          : employee.company.name || 'Neotech Consulting'}
                      </p>
                    )}
                    <div className="flex justify-center mt-4 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewEmployee(employee)}>
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedEmployee(employee);
                        handleEditEmployee();
                      }}>
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedEmployee && (
        <EmployeeViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          employee={selectedEmployee}
          onEdit={handleEditEmployee}
        />
      )}

      <EmployeeFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddSubmit}
      />

      {selectedEmployee && (
        <EmployeeFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditSubmit}
          employee={selectedEmployee}
          isEditing={true}
        />
      )}

      <DeleteEmployeeDialog 
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        employee={selectedEmployee}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default EmployeesProfiles;
