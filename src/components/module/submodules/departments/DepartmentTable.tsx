
import React from 'react';
import { Edit, Trash2, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Department } from './types';

interface DepartmentTableProps {
  departments: Department[];
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (id: string) => void;
  onManageEmployees: (department: Department) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  onEditDepartment,
  onDeleteDepartment,
  onManageEmployees,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>Département</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Employés</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => (
          <TableRow key={department.id}>
            <TableCell className="font-medium">{department.id}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: department.color }}
                ></div>
                <span>{department.name}</span>
              </div>
            </TableCell>
            <TableCell>{department.description}</TableCell>
            <TableCell>
              {department.managerName ? (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{department.managerName}</span>
                </div>
              ) : (
                <span className="text-gray-400">Non assigné</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{department.employeesCount || 0}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onManageEmployees(department)}
                  className="h-8 px-2"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Gérer
                </Button>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditDepartment(department)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteDepartment(department.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentTable;
