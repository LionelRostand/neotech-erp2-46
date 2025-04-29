
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Users } from 'lucide-react';
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
  // Vérification défensive pour le tableau departments
  const validDepartments = React.useMemo(() => {
    if (!departments || !Array.isArray(departments)) {
      console.warn("Invalid departments data:", departments);
      return [];
    }
    
    // Filtrer les entrées invalides et dédupliquer
    const deptMap = new Map<string, Department>();
    
    departments.forEach(dept => {
      if (dept && dept.id && !deptMap.has(dept.id)) {
        // S'assurer que toutes les propriétés requises existent
        const validDept = {
          ...dept,
          name: dept.name || 'Sans nom',
          description: dept.description || '',
          managerName: dept.managerName || 'N/A',
          companyName: dept.companyName || 'N/A',
          employeesCount: dept.employeesCount || (dept.employeeIds?.length || 0)
        };
        deptMap.set(dept.id, validDept as Department);
      }
    });
    
    return Array.from(deptMap.values());
  }, [departments]);

  console.log("Rendering department table with", validDepartments.length, "departments");

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">NOM</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>MANAGER</TableHead>
            <TableHead>ENTREPRISE</TableHead>
            <TableHead>EMPLOYÉS</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Chargement...
              </TableCell>
            </TableRow>
          ) : validDepartments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Aucun département trouvé.
              </TableCell>
            </TableRow>
          ) : (
            validDepartments.map((department) => (
              <TableRow key={department.id} className="border-b">
                <TableCell>
                  <div className="flex items-center">
                    {department.color && (
                      <span 
                        className="w-3 h-3 rounded-full inline-block mr-2" 
                        style={{ backgroundColor: department.color || '#3b82f6' }}
                      />
                    )}
                    <span className="font-medium">{department.name}</span>
                  </div>
                </TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.managerName || 'N/A'}</TableCell>
                <TableCell>{department.companyName || 'N/A'}</TableCell>
                <TableCell>{department.employeesCount || (department.employeeIds?.length || 0)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditDepartment(department.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditDepartment(department.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteDepartment(department.id, department.name || 'Sans nom')}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onManageEmployees(department.id)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
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
