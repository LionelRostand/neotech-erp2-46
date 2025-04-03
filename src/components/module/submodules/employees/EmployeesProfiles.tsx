import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import EmployeesList from './EmployeesList';
import EmployeeDetails from './EmployeeDetails';
import EmployeeForm from './EmployeeForm';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getEmployeesData, 
  refreshEmployeesData, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee 
} from './services/employeeService';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const EmployeesProfiles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { isOffline } = useAuth();

  const companies = [
    { id: 'all', name: 'Toutes les entreprises' },
    { id: 'enterprise1', name: 'Enterprise Solutions' },
    { id: 'techinno', name: 'TechInnovation' },
    { id: 'greenco', name: 'GreenCo' },
  ];

  useEffect(() => {
    loadEmployeesData();
  }, []);

  const loadEmployeesData = async () => {
    setLoading(true);
    try {
      const data = await getEmployeesData();
      setEmployees(data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Impossible de charger les données des employés");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const refreshedData = await refreshEmployeesData();
      setEmployees(refreshedData);
      toast.success("Données actualisées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      toast.error("Échec de l'actualisation des données");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = async (newEmployee: Partial<Employee>) => {
    setLoading(true);
    try {
      const addedEmployee = await addEmployee(newEmployee as Omit<Employee, 'id'>);
      
      if (addedEmployee) {
        setEmployees(prev => [...prev, addedEmployee]);
        toast.success("Employé ajouté avec succès.");
      } else {
        toast.error("Échec de l'ajout de l'employé.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      toast.error("Erreur lors de l'ajout de l'employé.");
    } finally {
      setLoading(false);
      setIsAddEmployeeOpen(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = async (updatedEmployeeData: Partial<Employee>) => {
    if (!employeeToEdit) return;
    
    setLoading(true);
    try {
      const updatedEmployee = await updateEmployee(employeeToEdit.id, updatedEmployeeData);
      
      if (updatedEmployee) {
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeToEdit.id ? updatedEmployee : emp
        ));
        
        if (selectedEmployee && selectedEmployee.id === employeeToEdit.id) {
          setSelectedEmployee(updatedEmployee);
        }
        
        toast.success("Employé mis à jour avec succès.");
      } else {
        toast.error("Échec de la mise à jour de l'employé.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de l'employé.");
    } finally {
      setLoading(false);
      setIsEditEmployeeOpen(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setLoading(true);
    try {
      const success = await deleteEmployee(employeeId);
      
      if (success) {
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        
        if (selectedEmployee && selectedEmployee.id === employeeId) {
          setSelectedEmployee(null);
        }
        
        toast.success("Employé supprimé avec succès.");
      } else {
        toast.error("Échec de la suppression de l'employé.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'employé.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    setIsPdfExportOpen(true);
    setTimeout(() => {
      setIsPdfExportOpen(false);
    }, 1000);
  };

  const filteredEmployees = selectedCompany === 'all' 
    ? employees 
    : employees.filter(emp => emp.company === selectedCompany);

  return (
    <div className="space-y-6">
      {selectedEmployee ? (
        <>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedEmployee(null)}
              className="mr-2"
            >
              <span className="mr-2">←</span> Retour à la liste
            </Button>
          </div>
          <EmployeeDetails 
            employee={selectedEmployee} 
            onExportPdf={handleExportPdf}
            onEdit={() => handleEditEmployee(selectedEmployee)}
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-md font-medium">Entreprise :</div>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleRefreshData}
                disabled={loading || isOffline}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button 
                variant="default" 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => setIsAddEmployeeOpen(true)}
              >
                Nouvel employé
              </Button>
            </div>
          </div>
          
          {isOffline && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
              <p className="text-amber-800 text-sm">
                Mode hors-ligne actif. Les données affichées peuvent ne pas être à jour.
              </p>
            </div>
          )}
          
          <EmployeesList
            employees={filteredEmployees}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewEmployee={handleViewEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            loading={loading}
          />
        </div>
      )}

      <EmployeeForm 
        open={isAddEmployeeOpen} 
        onOpenChange={setIsAddEmployeeOpen} 
        onSubmit={handleAddEmployee} 
      />

      {employeeToEdit && (
        <EmployeeForm 
          open={isEditEmployeeOpen}
          onOpenChange={setIsEditEmployeeOpen}
          onSubmit={handleUpdateEmployee}
          employee={employeeToEdit}
          isEditing={true}
        />
      )}

      <Dialog open={isPdfExportOpen} onOpenChange={setIsPdfExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export PDF en cours...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesProfiles;
