import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';
import EmployeeTable from './employees/EmployeeTable';
import EmployeeFilter from './employees/EmployeeFilter';
import { Plus, RefreshCw } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import CreateEmployeeDialog from './employees/CreateEmployeeDialog';
import ImportEmployeesDialog from './employees/ImportEmployeesDialog';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { safelyGetDocumentId } from '@/hooks/firestore/common-utils';
import EmployeesDashboardCards from './employees/dashboard/EmployeesDashboardCards';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EmployeesProfilesProps {
  employees: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees }) => {
  const { fetchedEmployees, isLoading } = useHrModuleData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  useEffect(() => {
    if (employees && employees.length > 0) {
      setEmployees(employees);
    } else if (fetchedEmployees) {
      setEmployees(fetchedEmployees);
    }
  }, [employees, fetchedEmployees]);

  const companies = [
    { id: 'all', name: 'Toutes les entreprises' },
    { id: 'enterprise1', name: 'Enterprise Solutions' },
    { id: 'techinno', name: 'TechInnovation' },
    { id: 'greenco', name: 'GreenCo' },
  ];

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = (newEmployee: Partial<Employee>) => {
    if (!newEmployee.id) {
      toast.error("Erreur: L'ID de l'employé est manquant");
      return;
    }
    
    console.log("Ajout d'un nouvel employé:", newEmployee);
    
    // Vérifier si l'employé existe déjà dans la liste locale
    const existingIndex = employees.findIndex(emp => emp.id === newEmployee.id);
    
    if (existingIndex >= 0) {
      // Mettre à jour l'employé existant dans la liste locale
      const updatedEmployees = [...employees];
      updatedEmployees[existingIndex] = { ...updatedEmployees[existingIndex], ...newEmployee } as Employee;
      setEmployees(updatedEmployees);
      toast.success("Employé mis à jour avec succès dans l'interface");
    } else {
      // Ajouter le nouvel employé à la liste locale
      const employeeWithId = newEmployee as Employee;
      const updatedEmployees = [...employees, employeeWithId];
      setEmployees(updatedEmployees);
      toast.success("Employé ajouté avec succès à l'interface");
    }
    
    // Fermer le formulaire
    setIsAddEmployeeOpen(false);
    
    // Si l'employé en cours d'affichage est celui qui a été modifié, mettre à jour la vue
    if (selectedEmployee && selectedEmployee.id === newEmployee.id) {
      setSelectedEmployee({ ...selectedEmployee, ...newEmployee } as Employee);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log('Édition de l\'employé:', employee);
    setEmployeeToEdit(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Partial<Employee>) => {
    if (!employeeToEdit || !updatedEmployee.id) return;
    
    console.log('Mise à jour de l\'employé:', updatedEmployee);
    
    // Mettre à jour l'employé dans la liste locale
    const updatedEmployees = employees.map(emp => 
      emp.id === updatedEmployee.id 
        ? { ...emp, ...updatedEmployee } as Employee
        : emp
    );
    
    setEmployees(updatedEmployees);
    
    // Si l'employé est actuellement sélectionné, mettre à jour aussi
    if (selectedEmployee && selectedEmployee.id === updatedEmployee.id) {
      setSelectedEmployee({ ...selectedEmployee, ...updatedEmployee } as Employee);
    }
    
    toast.success("Employé mis à jour avec succès dans l'interface");
    setIsEditEmployeeOpen(false);
    setEmployeeToEdit(null);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    // Supprimer l'employé de la liste locale
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    
    // Si l'employé supprimé est celui qui est affiché, revenir à la liste
    if (selectedEmployee && selectedEmployee.id === employeeId) {
      setSelectedEmployee(null);
    }
    
    toast.success("Employé supprimé avec succès");
  };

  const handleExportPdf = () => {
    setIsPdfExportOpen(true);
    setTimeout(() => {
      setIsPdfExportOpen(false);
    }, 1000);
  };

  // Filtrer les employés selon l'entreprise sélectionnée
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
                className="flex items-center gap-2"
                onClick={() => {
                  // Recharger les données depuis le hook
                  setEmployees(fetchedEmployees);
                  toast.success("Données des employés actualisées");
                }}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
            loading={isLoading}
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
