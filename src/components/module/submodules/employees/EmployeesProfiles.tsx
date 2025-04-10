import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import EmployeesList from './EmployeesList';
import EmployeeDetails from './EmployeeDetails';
import EmployeeForm from './EmployeeForm';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { RefreshCw } from 'lucide-react';
import { addDocument } from '@/hooks/firestore/create-operations';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { refreshEmployeesData } from './services/employeeService';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface EmployeesProfilesProps {
  employees?: Employee[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onViewEmployee?: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (employeeId: string) => void;
  onOpenAddEmployee?: () => void;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = (props) => {
  const { employees: fetchedEmployees, isLoading, error } = useEmployeeData();
  const [searchQuery, setSearchQuery] = useState(props.searchQuery || '');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { companies } = useHrModuleData();

  useEffect(() => {
    const employeesToUse = props.employees && props.employees.length > 0 
      ? props.employees 
      : fetchedEmployees;
      
    setEmployees(employeesToUse);
  }, [props.employees, fetchedEmployees]);

  const companyOptions = [
    { id: 'all', name: 'Toutes les entreprises' },
    ...companies.map(company => ({
      id: company.id,
      name: company.name
    }))
  ];

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = async (newEmployee: Partial<Employee>) => {
    try {
      const createdEmployee = await addDocument(COLLECTIONS.HR.EMPLOYEES, newEmployee);
      
      if (createdEmployee) {
        const employeeWithId = {
          ...newEmployee,
          id: createdEmployee.id,
        } as Employee;
        
        const updatedEmployees = [...employees, employeeWithId];
        setEmployees(updatedEmployees);
        toast.success("Employé ajouté avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      toast.error("Erreur lors de l'ajout de l'employé");
    }
    setIsAddEmployeeOpen(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Partial<Employee>) => {
    if (!employeeToEdit) return;
    
    const updatedEmployees = employees.map(emp => 
      emp.id === employeeToEdit.id 
        ? { ...emp, ...updatedEmployee } as Employee
        : emp
    );
    
    setEmployees(updatedEmployees);
    
    if (selectedEmployee && selectedEmployee.id === employeeToEdit.id) {
      setSelectedEmployee({ ...selectedEmployee, ...updatedEmployee } as Employee);
    }
    
    toast.success("Employé mis à jour avec succès.");
    setIsEditEmployeeOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    
    if (selectedEmployee && selectedEmployee.id === employeeId) {
      setSelectedEmployee(null);
    }
    
    toast.success("Employé supprimé avec succès.");
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const refreshedEmployees = await refreshEmployeesData();
      if (refreshedEmployees.length > 0) {
        setEmployees(refreshedEmployees);
        toast.success(`${refreshedEmployees.length} employés chargés avec succès`);
      }
    } catch (err) {
      console.error("Erreur lors de l'actualisation:", err);
    } finally {
      setIsRefreshing(false);
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
      {error && (
        <FirebaseErrorAlert 
          error={error} 
          onRetry={handleRefreshData}
          className="mb-4" 
        />
      )}

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
                  {companyOptions.map((company) => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleRefreshData}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
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
          
          <EmployeesList
            employees={filteredEmployees}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewEmployee={handleViewEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            loading={isLoading || isRefreshing}
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
