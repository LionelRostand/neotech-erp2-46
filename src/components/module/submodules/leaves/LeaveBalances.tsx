
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Define interface for employee balances to fix TypeScript errors
interface EmployeeBalance {
  id: string;
  name: string;
  photo: string;
  department: string;
  balances: Array<{
    type: string;
    total: number;
    used: number;
    remaining: number;
  }>;
}

export const LeaveBalances: React.FC = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { leaveBalances, isLoading } = useLeaveBalances();
  
  // Extract unique departments for filter
  const departments = Array.from(
    new Set(leaveBalances.map(balance => balance.department))
  ).filter(Boolean);
  
  // Apply filters
  const filteredBalances = leaveBalances.filter(balance => {
    // Department filter
    const matchesDepartment = departmentFilter === 'all' || balance.department === departmentFilter;
    
    // Search filter (case insensitive)
    const matchesSearch = searchQuery === '' || 
      balance.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });
  
  // Group balances by employee
  const employeeBalances = filteredBalances.reduce<Record<string, EmployeeBalance>>((acc, balance) => {
    if (!acc[balance.employeeId]) {
      acc[balance.employeeId] = {
        id: balance.employeeId,
        name: balance.employeeName,
        photo: balance.employeePhoto,
        department: balance.department,
        balances: []
      };
    }
    
    acc[balance.employeeId].balances.push({
      type: balance.type,
      total: balance.total,
      used: balance.used,
      remaining: balance.remaining
    });
    
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement des soldes de congés...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un employé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Employé</TableHead>
              <TableHead>Type de congé</TableHead>
              <TableHead>Acquis</TableHead>
              <TableHead>Pris</TableHead>
              <TableHead>Restant</TableHead>
              <TableHead>Utilisation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(employeeBalances).flatMap(employee => 
              // If employee has no balances, display an empty row
              employee.balances.length > 0 ? 
                employee.balances.map((balance, index) => (
                  <TableRow key={`${employee.id}-${balance.type}`}>
                    {/* Only display employee info on the first row for each employee */}
                    {index === 0 ? (
                      <TableCell rowSpan={employee.balances.length} className="align-top">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.photo} alt={employee.name} />
                            <AvatarFallback>{employee.name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.department}</p>
                          </div>
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell>{balance.type}</TableCell>
                    <TableCell>{balance.total} jours</TableCell>
                    <TableCell>{balance.used} jours</TableCell>
                    <TableCell className="font-medium">{balance.remaining} jours</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(balance.used / (balance.total || 1)) * 100} 
                          className="h-2" 
                        />
                        <span className="text-xs text-gray-500">
                          {balance.total ? Math.round((balance.used / balance.total) * 100) : 0}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : 
                // Default row for an employee with no leave balance
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.photo} alt={employee.name} />
                        <AvatarFallback>{employee.name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    Aucun solde de congés défini
                  </TableCell>
                </TableRow>
            )}
            {Object.keys(employeeBalances).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucun employé trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
