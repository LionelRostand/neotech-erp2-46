
import React, { useState, useEffect } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PlusCircle, X, SearchIcon, Trash2, Edit, Eye } from 'lucide-react';
import EmployeeViewDialog from './EmployeeViewDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import { updateEmployee, createEmployee } from './services/employeeService';
import EmployeeForm from './EmployeeForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EmployeeFilter } from './EmployeeFilter';

export default function EmployeesProfiles() {
  const { employees, isLoading } = useEmployeeData();
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all'
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!employees) return;

    let filtered = [...employees];
    
    // Apply search filter
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (employee) => 
          employee.firstName?.toLowerCase().includes(searchLower) || 
          employee.lastName?.toLowerCase().includes(searchLower) ||
          employee.email?.toLowerCase().includes(searchLower) ||
          employee.position?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(
        (employee) => 
          employee.department === filters.department || 
          employee.departmentId === filters.department
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(
        (employee) => employee.status === filters.status
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, search, filters]);

  const handleAddEmployee = async (newEmployee: Partial<Employee>) => {
    try {
      await createEmployee(newEmployee);
      toast.success("Nouvel employé créé avec succès");
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };

  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    if (!activeEmployee?.id) return;

    try {
      await updateEmployee(activeEmployee.id, updatedEmployee);
      toast.success("Employé mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    }
  };

  const handleDeleteSuccess = () => {
    // Refresh the employees list after successful deletion
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

  const handleViewEmployee = (employee: Employee) => {
    setActiveEmployee(employee);
    setIsViewOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setActiveEmployee(employee);
    setIsEditOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setActiveEmployee(employee);
    setIsDeleteOpen(true);
  };

  const renderEmployee = (employee: Employee) => {
    const status = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      onLeave: "bg-yellow-100 text-yellow-800",
      Actif: "bg-green-100 text-green-800",
      "En congé": "bg-yellow-100 text-yellow-800",
      Suspendu: "bg-red-100 text-red-800",
      Inactif: "bg-gray-100 text-gray-800"
    }[employee.status] || "bg-gray-100 text-gray-800";

    return (
      <tr key={employee.id} className="hover:bg-gray-50">
        <td className="px-4 py-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              {employee.photoURL || employee.photo ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={employee.photoURL || employee.photo}
                  alt=""
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <div className="text-sm text-gray-900">{employee.position || "-"}</div>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <div className="text-sm text-gray-900">{employee.department || "-"}</div>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${status}`}>
            {employee.status}
          </span>
        </td>
        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employés</h1>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un employé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        <EmployeeFilter onFilterChange={setFilters} />
      </div>

      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poste
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map(renderEmployee)
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    {search ? "Aucun employé ne correspond à votre recherche" : "Aucun employé trouvé"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <CreateEmployeeDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSubmit={handleAddEmployee}
        />
      </Dialog>

      {activeEmployee && (
        <>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <EmployeeForm 
              employee={activeEmployee} 
              isEditing={true}
              onSubmit={handleUpdateEmployee}
              onCancel={() => setIsEditOpen(false)}
            />
          </Dialog>

          <EmployeeViewDialog
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
            employee={activeEmployee}
          />

          <EmployeeDeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            employee={activeEmployee}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
}
