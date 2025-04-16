
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';
import EmployeeTable from './EmployeeTable';
import EmployeeFilter from './EmployeeFilter';
import { Plus, RefreshCw } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import ImportEmployeesDialog from './ImportEmployeesDialog';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EmployeesDashboardCards from './dashboard/EmployeesDashboardCards';

export interface EmployeesProfilesProps {
  employeesProp: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employeesProp }) => {
  const { employees: hrEmployees, isLoading, error, refetchEmployees } = useHrModuleData();
  const [openCreate, setOpenCreate] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the employees from props or from the hook if props are empty
  const employeesList = employeesProp && employeesProp.length > 0 ? employeesProp : hrEmployees;

  const filteredEmployees = employeesList.filter(employee => {
    const matchesDepartment = department === 'all' || employee.department === department;
    const matchesStatus = status === 'all' || employee.status === status;
    const matchesSearch = 
      searchTerm === '' ||
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchEmployees();
    toast.success('Données actualisées avec succès');
    setIsRefreshing(false);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreate(true);
  };
  
  const handleOpenImportDialog = () => {
    setOpenImport(true);
  };
  
  const handleCreated = () => {
    refetchEmployees();
  };
  
  const handleImported = (count: number) => {
    toast.success(`${count} employés importés avec succès`);
    refetchEmployees();
  };
  
  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      setIsDeleting(true);
      const id = employee.id;
      
      if (!id) {
        toast.error("ID de l'employé non trouvé");
        return;
      }
      
      await deleteDocument(COLLECTIONS.HR.EMPLOYEES, id);
      
      // Si l'employé était un manager, supprimer également son entrée dans la collection des managers
      if (employee.isManager) {
        try {
          // Chercher dans la collection des managers par employeeId
          const managersQuery = query(
            collection(db, COLLECTIONS.HR.MANAGERS),
            where("employeeId", "==", id)
          );
          
          const managersSnapshot = await getDocs(managersQuery);
          
          if (!managersSnapshot.empty) {
            const managerDoc = managersSnapshot.docs[0];
            await deleteDocument(COLLECTIONS.HR.MANAGERS, managerDoc.id);
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du manager:", error);
        }
      }
      
      toast.success(`L'employé ${employee.firstName} ${employee.lastName} a été supprimé avec succès`);
      refetchEmployees();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des employés</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel employé
          </Button>
        </div>
      </div>

      <EmployeesDashboardCards />
    
      <Card>
        <CardContent className="p-6">
          <EmployeeFilter 
            onDepartmentChange={setDepartment} 
            onStatusChange={setStatus} 
            onSearchChange={setSearchTerm}
            onImportClick={handleOpenImportDialog}
          />
          
          <div className="mt-6">
            <EmployeeTable 
              employees={filteredEmployees} 
              isLoading={isLoading || isDeleting} 
              onDelete={handleDeleteEmployee}
            />
          </div>
        </CardContent>
      </Card>
      
      <CreateEmployeeDialog 
        open={openCreate} 
        onOpenChange={setOpenCreate} 
        onCreated={handleCreated}
      />
      
      <ImportEmployeesDialog 
        open={openImport} 
        onOpenChange={setOpenImport} 
        onImported={handleImported}
      />
    </div>
  );
};

export default EmployeesProfiles;
