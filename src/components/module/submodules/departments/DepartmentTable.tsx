
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
import DepartmentCard from './DepartmentCard';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-md p-6 shadow-sm">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <div className="h-1 w-full bg-gray-100 mb-4" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <div 
          key={department.id} 
          className="border rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
          <div 
            className="h-2 w-full"
            style={{ backgroundColor: department.color }}
          />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">{department.name}</h3>
              <Badge
                variant="outline"
                className="bg-white text-xs"
                style={{ borderColor: department.color, color: department.color }}
              >
                {department.employeesCount || 0} employés
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm line-clamp-2">
              {department.description || "Aucune description"}
            </p>
            
            <div className="flex items-center space-x-1 mb-6">
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                Manager: {department.managerName || 'Non assigné'}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 border-t pt-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={() => onManageEmployees(department)}
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                Employés
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={() => onEditDepartment(department)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Modifier
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDeleteDepartment(department.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentTable;
