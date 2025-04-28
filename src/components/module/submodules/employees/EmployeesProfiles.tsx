
import React, { useState } from 'react';
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
import EmployeesDashboardCards from './dashboard/EmployeesDashboardCards';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EmployeesProfilesProps {
  employees: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees }) => {
  const { isLoading, error, refetchEmployees } = useHrModuleData();
  const [openCreate, setOpenCreate] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredEmployees = employees.filter(employee => {
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
    try {
      if (typeof refetchEmployees === 'function') {
        await refetchEmployees();
        toast.success('Données actualisées avec succès');
      } else {
        console.error("refetchEmployees is not a function");
        toast.error('Erreur lors de l\'actualisation des données');
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error('Erreur lors de l\'actualisation des données');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenCreate(true);
  };
  
  const handleOpenImportDialog = () => {
    setOpenImport(true);
  };
  
  const handleCreated = (newEmployee: Employee) => {
    if (typeof refetchEmployees === 'function') {
      refetchEmployees();
    } else {
      console.warn("refetchEmployees is not a function, cannot refresh data after employee creation");
      toast.info('Veuillez actualiser la page pour voir le nouvel employé');
    }
  };
  
  const handleImported = (count: number) => {
    toast.success(`${count} employés importés avec succès`);
    if (typeof refetchEmployees === 'function') {
      refetchEmployees();
    } else {
      console.warn("refetchEmployees is not a function, cannot refresh data after employee import");
      toast.info('Veuillez actualiser la page pour voir les employés importés');
    }
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
      
      if (typeof refetchEmployees === 'function') {
        refetchEmployees();
      } else {
        console.warn("refetchEmployees is not a function, cannot refresh data after employee deletion");
        toast.info('Veuillez actualiser la page pour mettre à jour la liste');
      }
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
