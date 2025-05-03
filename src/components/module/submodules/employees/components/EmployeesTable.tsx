
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
  // Filter out any null/undefined employee objects and ensure we have a valid array
  const validEmployees = useMemo(() => {
    // First check if employees is an array
    if (!Array.isArray(employees)) {
      console.warn('EmployeesTable: employees prop is not an array');
      return [];
    }
    // Then filter out any null/undefined values
    return employees.filter(Boolean);
  }, [employees]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des employés...</div>;
  }

  if (!validEmployees || validEmployees.length === 0) {
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
              key={employee.id || `emp-${Math.random()}`} 
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
