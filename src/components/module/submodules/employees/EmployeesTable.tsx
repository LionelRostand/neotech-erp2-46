
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
  // Récupérer les départements
  const { departments = [] } = useEmployeeData();
  
  // Ensure we have valid data to work with
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];
  
  const columns: Column<Employee>[] = [
    {
      header: 'EMPLOYÉ',
      accessorKey: 'name',
      cell: ({ row }) => {
        const employee = row?.original;
        if (!employee) return null;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              {employee.photoURL || employee.photo ? (
                <AvatarImage 
                  src={employee.photoURL || employee.photo} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                />
              ) : (
                <AvatarFallback>
                  {(employee.firstName?.[0] || '')}{(employee.lastName?.[0] || '')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{employee.firstName || ''} {employee.lastName || ''}</p>
              <p className="text-xs text-gray-500">{employee.phone || ''}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'POSTE',
      accessorKey: 'position',
      cell: ({ row }) => <span className="text-sm">{row.original?.position || '-'}</span>
    },
    {
      header: 'EMAIL',
      accessorKey: 'email',
      cell: ({ row }) => (
        <span className="text-sm text-blue-600">{row.original?.email || row.original?.professionalEmail || '-'}</span>
      )
    },
    {
      header: 'DÉPARTEMENT',
      accessorKey: 'department',
      cell: ({ row }) => {
        const departmentId = row.original?.department || row.original?.departmentId;
        return <span className="text-sm">{getDepartmentName(departmentId, safeDepartments)}</span>;
      }
    },
    {
      header: 'STATUT',
      accessorKey: 'status',
      cell: ({ row }) => <EmployeeStatusBadge status={row.original?.status || 'active'} />
    },
    {
      header: 'ACTIONS',
      cell: ({ row }) => {
        if (!row?.original) return null;
        
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={safeEmployees}
      isLoading={isLoading}
      onRowClick={onView}
      emptyMessage="Aucun employé trouvé"
    />
  );
};

export default EmployeesTable;
