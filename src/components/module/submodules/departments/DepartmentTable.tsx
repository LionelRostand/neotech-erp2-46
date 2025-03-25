
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Users } from 'lucide-react';
import { Department } from './types';
import { Skeleton } from '@/components/ui/skeleton';

interface DepartmentTableProps {
  departments: Department[];
  loading: boolean;
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (id: string) => void;
  onManageEmployees: (department: Department) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  loading,
  onEditDepartment,
  onDeleteDepartment,
  onManageEmployees
}) => {
  if (loading) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Employés</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-60" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  if (departments.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun département</h3>
        <p className="text-gray-500 mb-4">Créez votre premier département pour commencer</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Employés</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: department.color }}
                  />
                  <span className="font-medium">{department.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-sm text-gray-600">
                  {department.description || "Aucune description"}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {department.managerName || 'Non assigné'}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: department.color, color: department.color }}
                >
                  {department.employeesCount || 0} employés
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onManageEmployees(department)}
                    title="Gérer les employés"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEditDepartment(department)}
                    title="Modifier le département"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteDepartment(department.id)}
                    title="Supprimer le département"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentTable;
