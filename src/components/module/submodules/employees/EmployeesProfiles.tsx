import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { DataTable } from '@/components/ui/data-table';
import { Employee } from '@/types/employee';
import { Eye, Edit, Trash, Plus, UserPlus } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { toast } from 'sonner';
import EmployeesStats from './EmployeesStats';
import EmployeeViewDialog from './EmployeeViewDialog';
import { Badge } from "@/components/ui/badge";

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees = [], isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const searchTerm = searchQuery.toLowerCase();
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const department = employee.department ? employee.department.toLowerCase() : '';
    const position = employee.position ? employee.position.toLowerCase() : '';
    const email = employee.email ? employee.email.toLowerCase() : '';

    return (
      fullName.includes(searchTerm) ||
      department.includes(searchTerm) ||
      position.includes(searchTerm) ||
      email.includes(searchTerm)
    );
  });

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setIsAddDialogOpen(true);
  };

  const columns = [
    {
      header: "Employé",
      accessorKey: "name",
      cell: ({ row }: { row: { original: Employee } }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
            {employee.photoURL ? (
              <img 
                src={employee.photoURL} 
                alt={`${employee.firstName} ${employee.lastName}`}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium">
                {employee.firstName?.charAt(0) || ''}{employee.lastName?.charAt(0) || ''}
              </div>
            )}
            <div>
              <div className="font-medium">{employee.firstName} {employee.lastName}</div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Poste",
      accessorKey: "position",
    },
    {
      header: "Département",
      accessorKey: "department",
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }: { row: { original: Employee } }) => {
        const status = row.original.status;
        let badgeClass = "";
        let statusLabel = status;
        
        switch (status?.toLowerCase()) {
          case 'active':
          case 'actif':
            badgeClass = "bg-green-100 text-green-800";
            statusLabel = "Actif";
            break;
          case 'inactive':
          case 'inactif':
            badgeClass = "bg-red-100 text-red-800";
            statusLabel = "Inactif";
            break;
          case 'onleave':
          case 'en congé':
            badgeClass = "bg-amber-100 text-amber-800";
            statusLabel = "En congé";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
            statusLabel = status || "Non défini";
        }
        
        return (
          <Badge className={badgeClass}>{statusLabel}</Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: { row: { original: Employee } }) => {
        const employee = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewEmployee(employee);
              }}
              className="hover:bg-purple-50 text-purple-700"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Voir</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditEmployee(employee);
              }}
              className="hover:bg-blue-50 text-blue-700"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEmployee(employee);
              }}
              className="hover:bg-red-50 text-red-700"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employés</h1>
        <Button className="gap-2" onClick={handleAddEmployee}>
          <UserPlus className="h-4 w-4" />
          <span>Ajouter un employé</span>
        </Button>
      </div>

      <EmployeesStats employees={employees} />

      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Liste des employés</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un employé..."
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredEmployees}
            isLoading={isLoading}
            emptyMessage="Aucun employé trouvé"
          />
        </div>
      </div>

      <EmployeeViewDialog
        employee={selectedEmployee}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEditEmployee={handleEditEmployee}
      />

      {/* TODO: Add Edit Dialog */}
      {/* TODO: Add Delete Dialog */}
      {/* TODO: Add New Employee Dialog */}
    </div>
  );
};

export default EmployeesProfiles;
