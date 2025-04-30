
import React, { useState, useEffect, useCallback } from 'react';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import DataTable from '@/components/DataTable';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeeViewDialog from './dialogs/EmployeeViewDialog';
import EmployeeEditDialog from './dialogs/EmployeeEditDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeesStats from './EmployeesStats';
import { toast } from 'sonner';
import { PlusCircle, Search, X } from 'lucide-react';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';

const EmployeesProfiles: React.FC = () => {
  // State pour les données des employés
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State pour l'employé sélectionné
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // États des dialogues
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Récupérer les données avec Firebase directement
  const fetchEmployeesData = async () => {
    setIsLoading(true);
    try {
      const employeesCollectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const querySnapshot = await getDocs(employeesCollectionRef);
      
      const employees = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          // S'assurer que les champs requis ont des valeurs par défaut
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          position: data.position || '',
          department: data.department || '',
          phone: data.phone || ''
        } as Employee;
      });
      
      console.log('Employés récupérés:', employees);
      setEmployeesData(employees);
      setFilteredEmployees(employees);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les données au montage du composant
  useEffect(() => {
    fetchEmployeesData();
  }, []);

  // Gérer la création d'un employé
  const handleCreateEmployee = () => {
    console.log('Création d\'employé');
    fetchEmployeesData(); // Rafraîchir les données après création
    onCreateClose();
  };

  // Gérer la mise à jour d'un employé
  const handleUpdateSuccess = () => {
    console.log('Employé mis à jour');
    fetchEmployeesData(); // Rafraîchir les données après mise à jour
  };

  // Gérer la suppression d'un employé
  const handleDeleteSuccess = () => {
    console.log('Employé supprimé');
    fetchEmployeesData(); // Rafraîchir les données après suppression
    onDeleteClose();
  };

  // Gérer l'affichage d'un employé
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    onViewOpen();
  };

  // Gérer l'édition d'un employé
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    onEditOpen();
  };

  // Gérer la demande de suppression d'un employé
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    onDeleteOpen();
  };

  // Gérer le changement de filtre
  const handleFilterChange = (filtered: Employee[]) => {
    setFilteredEmployees(filtered);
  };

  // Transition de la vue vers l'édition
  const handleTransitionToEdit = () => {
    onViewClose();
    onEditOpen();
  };

  // Définir les colonnes de la table
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }: { row: any }) => {
        const id = row.original.id || '';
        return <span className="font-mono text-xs">{id.substring(0, 8)}</span>;
      }
    },
    {
      header: "Nom",
      cell: ({ row }: { row: any }) => {
        const employee = row.original;
        const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`;
        return <span className="font-medium">{fullName.trim() || 'N/A'}</span>;
      }
    },
    {
      header: "Poste",
      accessorKey: "position",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original.position || 'N/A'}</span>;
      }
    },
    {
      header: "Département",
      accessorKey: "department",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original.department || 'N/A'}</span>;
      }
    },
    {
      header: "Téléphone",
      accessorKey: "phone",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original.phone || 'N/A'}</span>;
      }
    },
    {
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewEmployee(employee);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditEmployee(employee);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(employee);
              }}
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
      <EmployeesStats employees={employeesData} />
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employés</h1>
        <Button onClick={onCreateOpen} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" /> Ajouter un employé
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
      
      {/* Dialogue pour voir les détails */}
      {selectedEmployee && (
        <EmployeeViewDialog 
          open={isViewOpen}
          onOpenChange={onViewClose}
          employee={selectedEmployee}
          onEdit={handleTransitionToEdit}
        />
      )}
      
      {/* Dialogue pour éditer un employé */}
      {selectedEmployee && (
        <EmployeeEditDialog
          open={isEditOpen}
          onOpenChange={onEditClose}
          employee={selectedEmployee}
          onSuccess={handleUpdateSuccess}
        />
      )}
      
      {/* Dialogue pour supprimer un employé */}
      <EmployeeDeleteDialog
        open={isDeleteOpen}
        onOpenChange={onDeleteClose}
        employee={selectedEmployee}
        onSuccess={handleDeleteSuccess}
      />
      
      {/* Dialogue pour créer un employé */}
      <CreateEmployeeDialog
        open={isCreateOpen}
        onOpenChange={onCreateClose}
        onSubmit={handleCreateEmployee}
      />
    </div>
  );
};

export default EmployeesProfiles;
