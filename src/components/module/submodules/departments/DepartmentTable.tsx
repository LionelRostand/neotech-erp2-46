
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
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <DepartmentCard key={department.id} title={department.name}>
          <div className="space-y-3">
            <div 
              className="w-full h-1 rounded-full mt-1"
              style={{ backgroundColor: department.color }}
            />
            
            <p className="text-sm text-gray-600">{department.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Manager:</span>{' '}
                {department.managerName || 'Non assigné'}
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Employés:</span>{' '}
                {department.employeesCount || 0}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onManageEmployees(department)}
              >
                <Users className="h-4 w-4 mr-1" />
                Employés
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEditDepartment(department)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDeleteDepartment(department.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </DepartmentCard>
      ))}
    </div>
  );
};

export default DepartmentTable;
