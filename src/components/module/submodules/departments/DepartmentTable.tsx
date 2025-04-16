
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Users } from 'lucide-react';
import { Department } from './types';

interface DepartmentTableProps {
  departments: Department[];
  loading: boolean;
  onEditDepartment: (id: string) => void;
  onDeleteDepartment: (id: string, name: string) => void;
  onManageEmployees: (id: string) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ 
  departments, 
  loading,
  onEditDepartment, 
  onDeleteDepartment, 
  onManageEmployees 
}) => {
  // Ensure departments are unique by ID
  const uniqueDepartments = React.useMemo(() => {
    const deptMap = new Map<string, Department>();
    departments.forEach(dept => {
      if (!deptMap.has(dept.id)) {
        deptMap.set(dept.id, dept);
      }
    });
    return Array.from(deptMap.values());
  }, [departments]);

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Employés</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Chargement...
              </TableCell>
            </TableRow>
          ) : uniqueDepartments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucun département trouvé.
              </TableCell>
            </TableRow>
          ) : (
            uniqueDepartments.map((department) => (
              <TableRow key={`${department.id}-${department.name}`}>
                <TableCell className="font-medium">{department.id}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.managerName || 'N/A'}</TableCell>
                <TableCell>{department.companyId || 'Aucune entreprise'}</TableCell>
                <TableCell>{department.employeesCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEditDepartment(department.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteDepartment(department.id, department.name)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onManageEmployees(department.id)}>
                    <Users className="h-4 w-4 mr-2" />
                    Gérer
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentTable;
