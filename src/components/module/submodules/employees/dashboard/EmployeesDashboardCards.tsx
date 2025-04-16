
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Building } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';

const EmployeesDashboardCards: React.FC = () => {
  const { employees, departments, companies, isLoading } = useHrModuleData();
  
  // Count active employees
  const activeEmployees = employees.filter(emp => emp.status === 'active' || emp.status === 'Active' || emp.status === 'Actif').length;
  
  // Count inactive employees
  const inactiveEmployees = employees.filter(emp => emp.status === 'inactive' || emp.status === 'Inactive' || emp.status === 'Inactif').length;
  
  // Count departments
  const departmentsCount = new Set(employees.map(emp => emp.department)).size;
  
  // Count companies
  const companiesCount = companies.length;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '-' : employees.length}</div>
          <p className="text-xs text-muted-foreground">
            Employés inscrits dans l'application
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Employés Actifs</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '-' : activeEmployees}</div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? '' : `${Math.round((activeEmployees / employees.length) * 100)}% du total`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Départements</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '-' : departmentsCount}</div>
          <p className="text-xs text-muted-foreground">
            Répartition dans l'entreprise
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '-' : inactiveEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Employés en congé ou inactifs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesDashboardCards;
