
import React, { useEffect, useState } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeesStats from './EmployeesStats';
import { Chart } from 'lucide-react';

const EmployeesDashboardModule = () => {
  const { employees, departments, isLoading } = useEmployeeData();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Tableau de bord des employés</h2>
        </div>
        <div className="grid gap-6">
          <Card className="p-8">
            <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const departmentsWithCounts = departments.map(dept => {
    const employeesInDept = employees.filter(emp => 
      emp.department === dept.id || emp.departmentId === dept.id
    ).length;
    
    return {
      name: dept.name || 'N/A',
      count: employeesInDept,
      color: dept.color || '#3b82f6'
    };
  });

  // Calculate stats for active/inactive employees
  const activeEmployees = employees.filter(emp => emp.status === 'active' || emp.status === 'Actif').length;
  const inactiveEmployees = employees.length - activeEmployees;
  
  // Find newest employees (hired in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentlyHiredEmployees = employees
    .filter(emp => {
      const hireDate = emp.hireDate ? new Date(emp.hireDate) : null;
      return hireDate && hireDate > thirtyDaysAgo;
    })
    .sort((a, b) => {
      const dateA = new Date(a.hireDate || '');
      const dateB = new Date(b.hireDate || '');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Tableau de bord des employés</h2>
      </div>
      
      <div className="grid gap-6">
        {/* Stats Cards */}
        <EmployeesStats employees={employees} />
        
        {/* Department Distribution & Status Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Chart className="w-5 h-5 mr-2 text-blue-600" />
              <h3 className="text-lg font-semibold">Répartition par département</h3>
            </div>
            <div className="space-y-3">
              {departmentsWithCounts.map((dept, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-full max-w-xs mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <span className="text-sm text-gray-500">{dept.count} employés</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${(dept.count / employees.length) * 100}%`,
                          backgroundColor: dept.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Chart className="w-5 h-5 mr-2 text-green-600" />
              <h3 className="text-lg font-semibold">Statut des employés</h3>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-40 h-40 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-xl font-bold">{employees.length}</span>
                    <span className="text-sm text-gray-500">Total</span>
                  </div>
                </div>
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  {/* Active employees (green) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeDasharray={`${(activeEmployees / employees.length) * 100}, 100`}
                    className="stroke-green-400"
                  />
                  {/* Inactive employees (gray) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray={`${(inactiveEmployees / employees.length) * 100}, 100`}
                    strokeDashoffset={-1 * (activeEmployees / employees.length) * 100}
                  />
                </svg>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-sm">Actifs ({activeEmployees})</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                  <span className="text-sm">Inactifs ({inactiveEmployees})</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Recently hired employees */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Employés récemment embauchés</h3>
          {recentlyHiredEmployees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Employé</th>
                    <th className="px-6 py-3 text-left">Poste</th>
                    <th className="px-6 py-3 text-left">Département</th>
                    <th className="px-6 py-3 text-left">Date d'embauche</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyHiredEmployees.map((employee) => {
                    const dept = departments.find(d => d.id === employee.department || d.id === employee.departmentId);
                    const hireDate = employee.hireDate ? new Date(employee.hireDate) : null;
                    
                    return (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                            {employee.photoURL && (
                              <img src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <span>{employee.firstName} {employee.lastName}</span>
                        </td>
                        <td className="px-6 py-4">{employee.position || employee.title || 'N/A'}</td>
                        <td className="px-6 py-4">{dept?.name || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {hireDate ? hireDate.toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Aucun employé embauché au cours des 30 derniers jours
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployeesDashboardModule;
