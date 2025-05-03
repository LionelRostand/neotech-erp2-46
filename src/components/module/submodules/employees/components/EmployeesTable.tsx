
import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/patched-table';
import { Employee } from '@/types/employee';
import EmployeeListItem from './EmployeeListItem';

interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onEmployeeClick?: (employee: Employee) => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees = [],
  isLoading = false,
  onEmployeeClick
}) => {
  // Filter out any null/undefined employee objects
  const validEmployees = useMemo(() => {
    return Array.isArray(employees) ? employees.filter(Boolean) : [];
  }, [employees]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des employés...</div>;
  }

  if (validEmployees.length === 0) {
    return <div className="flex justify-center p-8">Aucun employé trouvé.</div>;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NOM</TableHead>
            <TableHead>DÉPARTEMENT</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>DATE D'EMBAUCHE</TableHead>
            <TableHead>STATUT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validEmployees.map((employee) => (
            <EmployeeListItem 
              key={employee.id} 
              employee={employee} 
              onEmployeeClick={onEmployeeClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;
