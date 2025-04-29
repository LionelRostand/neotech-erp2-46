
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeeViewDialog from './EmployeeViewDialog';
import EmployeeProfileHeader from './EmployeeProfileHeader';
import DeleteEmployeeDialog from './DeleteEmployeeDialog';
import { toast } from 'sonner';
import { useFirestore, doc, deleteDoc } from '@/lib/firebase';
import EmployeesDashboardCards from './dashboard/EmployeesDashboardCards';
import EmployeesStats from './EmployeesStats';

const EmployeesProfiles: React.FC = () => {
  const { employees, isLoading } = useEmployeeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const db = useFirestore();
  
  const handleEmployeeCreated = (employee: Employee) => {
    toast.success(`L'employé ${employee.firstName} ${employee.lastName} a été créé avec succès.`);
    setShowCreateDialog(false);
  };
  
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewDialog(true);
  };
  
  const handleEditEmployee = () => {
    setShowViewDialog(false);
    setShowEditDialog(true);
  };
  
  const handleEmployeeUpdated = (updatedEmployee: Partial<Employee>) => {
    toast.success("Les informations de l'employé ont été mises à jour avec succès.");
    setShowEditDialog(false);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "employees", selectedEmployee.id));
      toast.success(`L'employé ${selectedEmployee.firstName} ${selectedEmployee.lastName} a été supprimé avec succès.`);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Une erreur est survenue lors de la suppression de l'employé.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const position = (employee.position || '').toLowerCase();
    const department = (employee.department || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      fullName.includes(query) || 
      position.includes(query) || 
      department.includes(query)
    );
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employés</h1>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Dashboard Cards */}
      <EmployeesDashboardCards />
      
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Employés</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        </div>
      </div>
      
      {/* Employee Statistics */}
      <div className="my-6">
        <EmployeesStats employees={employees} />
      </div>
      
      {/* Employees Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Aucun employé trouvé</h3>
          <p className="text-gray-500">Aucun employé ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(employee => (
            <div 
              key={employee.id} 
              className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewEmployee(employee)}
            >
              <div className="p-4">
                <div className="flex items-center">
                  {/* Employee Avatar */}
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/10">
                      {employee.photoURL || employee.photo ? (
                        <img 
                          src={employee.photoURL || employee.photo} 
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-primary">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Employee Info */}
                  <div>
                    <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-gray-500 text-sm">{employee.position || 'Poste non spécifié'}</p>
                    <p className="text-gray-400 text-xs">{employee.department || 'Département non spécifié'}</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(employee);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Supprimer
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                  >
                    Voir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Employee Dialog */}
      <CreateEmployeeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onEmployeeCreated={handleEmployeeCreated}
      />
      
      {/* View Employee Dialog */}
      {selectedEmployee && (
        <EmployeeViewDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          employee={selectedEmployee}
          onEdit={handleEditEmployee}
        />
      )}
      
      {/* Delete Employee Dialog */}
      {selectedEmployee && (
        <DeleteEmployeeDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteEmployee}
          employee={selectedEmployee}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
