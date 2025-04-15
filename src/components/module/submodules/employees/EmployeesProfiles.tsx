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
import { safelyGetDocumentId } from '@/hooks/firestore/common-utils';
import EmployeesDashboardCards from './dashboard/EmployeesDashboardCards';

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
  
  const handleDeleteEmployee = (record: any) => {
    const id = safelyGetDocumentId(record);
    toast.info(`Suppression de l'employé ${id} demandée`);
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
              employees={filteredEmployees as Employee[]} 
              isLoading={isLoading} 
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
