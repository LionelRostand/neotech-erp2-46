
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table-types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useDisclosure } from '@/hooks/useDisclosure';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeeViewDialog from './EmployeeViewDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeeFilter from './EmployeeFilter';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EmployeesStats from './EmployeesStats';

interface EmployeesProfilesProps {
  employees?: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = () => {
  // State for employees data
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for selected employee
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Dialog states
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Fetch data using Firebase directly
  const fetchEmployeesData = async () => {
    setIsLoading(true);
    try {
      const employeesCollectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const querySnapshot = await getDocs(employeesCollectionRef);
      
      const employees = querySnapshot.docs.map(doc => {
        const data = doc.data() as Employee;
        return {
          ...data,
          id: doc.id,
          // Ensure required fields have default values if missing
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          position: data.position || '',
          department: data.department || '',
          phone: data.phone || '',
        };
      });
      
      console.log('Fetched employees:', employees);
      setEmployeesData(employees);
      setFilteredEmployees(employees);
    } catch (error) {
      console.error('Error fetching employees data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployeesData();
  }, []);

  // Handle employee creation
  const handleCreateEmployee = (newEmployee: Partial<Employee>) => {
    console.log('Creating employee:', newEmployee);
    onCreateClose();
    fetchEmployeesData(); // Refresh data after creation
  };

  // Handle employee update
  const handleUpdateEmployee = (updatedEmployee: Partial<Employee>) => {
    console.log('Updating employee:', updatedEmployee);
    onViewClose();
    fetchEmployeesData(); // Refresh data after update
  };

  // Handle employee deletion
  const handleDeleteSuccess = () => {
    console.log('Employee deleted');
    onDeleteClose();
    fetchEmployeesData(); // Refresh data after deletion
  };

  // Handle view employee
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    onViewOpen();
  };

  // Handle delete employee
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    onDeleteOpen();
  };

  // Handle filter change
  const handleFilterChange = (filtered: Employee[]) => {
    setFilteredEmployees(filtered);
  };

  // Define table columns
  const columns: Column<Employee>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => {
        const id = row.original.id || '';
        return <span className="font-mono text-xs">{id.substring(0, 8)}</span>;
      }
    },
    {
      header: "Nom",
      cell: ({ row }) => {
        const employee = row.original;
        const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`;
        return <span className="font-medium">{fullName.trim() || 'N/A'}</span>;
      }
    },
    {
      header: "Poste",
      accessorKey: "position",
      cell: ({ row }) => {
        return <span>{row.original.position || 'N/A'}</span>;
      }
    },
    {
      header: "Département",
      accessorKey: "department",
      cell: ({ row }) => {
        return <span>{row.original.department || 'N/A'}</span>;
      }
    },
    {
      header: "Téléphone",
      accessorKey: "phone",
      cell: ({ row }) => {
        return <span>{row.original.phone || 'N/A'}</span>;
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => handleViewEmployee(employee)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-destructive"
              onClick={() => handleDeleteClick(employee)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Dashboard component at the top */}
      <EmployeesStats employees={employeesData} />
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employés</h1>
        <Button onClick={onCreateOpen} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Ajouter un employé
        </Button>
      </div>
      
      <EmployeeFilter 
        employees={employeesData} 
        onFilterChange={handleFilterChange}
      />
      
      <DataTable
        columns={columns}
        data={filteredEmployees}
        isLoading={isLoading}
        emptyMessage="Aucun employé trouvé"
        onRowClick={handleViewEmployee}
      />
      
      {selectedEmployee && (
        <>
          <EmployeeViewDialog
            open={isViewOpen}
            onOpenChange={onViewOpen}
            employee={selectedEmployee}
            onSubmit={handleUpdateEmployee}
          />
          
          <EmployeeDeleteDialog
            open={isDeleteOpen}
            onOpenChange={onDeleteClose}
            employee={selectedEmployee}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
      
      <CreateEmployeeDialog
        open={isCreateOpen}
        onOpenChange={onCreateClose}
        onSubmit={handleCreateEmployee}
      />
    </div>
  );
};

export default EmployeesProfiles;
