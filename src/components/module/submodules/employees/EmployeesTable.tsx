
import React from 'react';
import { Employee } from '@/types/employee';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table-types';
import EmployeeStatusBadge from './EmployeeStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDepartmentName } from './utils/departmentUtils';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface EmployeesTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isLoading?: boolean;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const { departments } = useEmployeeData();
  
  const columns: Column<Employee>[] = [
    {
      header: 'Employé',
      accessorKey: 'name',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {employee.photoURL || employee.photo ? (
                <AvatarImage 
                  src={employee.photoURL || employee.photo} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                />
              ) : (
                <AvatarFallback>
                  {employee.firstName?.[0]}{employee.lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{employee.firstName} {employee.lastName}</p>
              <p className="text-xs text-gray-500">{employee.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Poste',
      accessorKey: 'position',
      cell: ({ row }) => row.original.position || '-'
    },
    {
      header: 'Département',
      accessorKey: 'department',
      cell: ({ row }) => {
        const departmentId = row.original.department || row.original.departmentId;
        return getDepartmentName(departmentId, departments);
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <EmployeeStatusBadge status={row.original.status || 'active'} />
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={employees}
      isLoading={isLoading}
      onRowClick={onView}
      emptyMessage="Aucun employé trouvé"
    />
  );
};

export default EmployeesTable;
