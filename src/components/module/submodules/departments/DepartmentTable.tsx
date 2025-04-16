
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash } from 'lucide-react';
import { Department } from './types';
import { useCompaniesData } from '@/hooks/useCompaniesData';

interface DepartmentTableProps {
  departments: Department[];
  loading: boolean;
  onEditDepartment: (id: string) => void;
  onDeleteDepartment: (id: string, name: string) => void;
  onViewDepartment: (id: string) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ 
  departments, 
  loading,
  onEditDepartment, 
  onDeleteDepartment, 
  onViewDepartment 
}) => {
  const { companies } = useCompaniesData();

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

  // Function to get company name from ID
  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return 'Aucune entreprise';
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Aucune entreprise';
  };

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
                <TableCell>{getCompanyName(department.companyId)}</TableCell>
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
                  <Button variant="ghost" size="sm" onClick={() => onViewDepartment(department.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
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
