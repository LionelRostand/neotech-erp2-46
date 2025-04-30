
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeesStats from './EmployeesStats';
import { BarChart, PieChart, Users } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { LineChart } from '@/components/ui/line-chart';
import { BarChart as CustomBarChart } from '@/components/ui/charts';
import { PieChart as CustomPieChart } from '@/components/ui/charts';
import StatCard from '@/components/StatCard';

const EmployeesDashboardModule = () => {
  const { employees, departments, isLoading } = useEmployeeData();
  
  const { 
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    departmentCounts,
    recentHires,
    employeesByStatus
  } = useMemo(() => {
    if (!employees || !Array.isArray(employees)) {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        departmentCounts: [],
        recentHires: [],
        employeesByStatus: { active: 0, inactive: 0, onLeave: 0 }
      };
    }

    // Calculate key metrics
    const total = employees.length;
    const active = employees.filter(e => 
      e.status === 'active' || e.status === 'Actif'
    ).length;
    const inactive = total - active;

    // Get department distribution
    const deptMap = new Map();
    employees.forEach(emp => {
      const deptId = emp.department || emp.departmentId || 'Non spécifié';
      deptMap.set(deptId, (deptMap.get(deptId) || 0) + 1);
    });

    const deptsWithNames = Array.from(deptMap.entries()).map(([deptId, count]) => {
      const deptName = departments?.find(d => d.id === deptId)?.name || deptId;
      return {
        department: deptName,
        count: count as number,
      };
    });

    // Get recent hires
    const sortedByHireDate = [...employees].sort((a, b) => {
      const dateA = a.hireDate ? new Date(a.hireDate).getTime() : 0;
      const dateB = b.hireDate ? new Date(b.hireDate).getTime() : 0;
      return dateB - dateA;
    });

    // Status count
    const byStatus = {
      active: employees.filter(e => e.status === 'active' || e.status === 'Actif').length,
      inactive: employees.filter(e => e.status === 'inactive' || e.status === 'Inactif').length,
      onLeave: employees.filter(e => e.status === 'onLeave' || e.status === 'En congé').length
    };

    return {
      totalEmployees: total,
      activeEmployees: active,
      inactiveEmployees: inactive,
      departmentCounts: deptsWithNames,
      recentHires: sortedByHireDate.slice(0, 5),
      employeesByStatus: byStatus
    };
  }, [employees, departments]);

  // Format data for charts
  const departmentChartData = departmentCounts.map(dept => ({
    name: dept.department,
    value: dept.count
  }));

  const statusChartData = {
    labels: ['Actifs', 'Inactifs', 'En congé'],
    datasets: [
      {
        label: 'Employés par statut',
        data: [employeesByStatus.active, employeesByStatus.inactive, employeesByStatus.onLeave],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Chargement des données...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord des Employés</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Effectif total" 
          value={`${totalEmployees}`} 
          icon={<Users size={24} className="text-blue-500" />}
          description="Nombre total d'employés"
          className="border-l-4 border-blue-500"
        />
        <StatCard 
          title="Employés actifs" 
          value={`${activeEmployees}`}
          icon={<Users size={24} className="text-green-500" />}
          description={`${Math.round((activeEmployees / totalEmployees) * 100)}% de l'effectif total`}
          className="border-l-4 border-green-500"
        />
        <StatCard 
          title="Employés inactifs" 
          value={`${inactiveEmployees}`}
          icon={<Users size={24} className="text-red-500" />}
          description={`${Math.round((inactiveEmployees / totalEmployees) * 100)}% de l'effectif total`}
          className="border-l-4 border-red-500"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <BarChart size={16} />
            <span>Départements</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <PieChart size={16} />
            <span>Statuts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Répartition par département</CardTitle>
              <CardDescription>Distribution des employés par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {departmentChartData.length > 0 ? (
                  <CustomBarChart
                    data={{
                      labels: departmentChartData.map(d => d.name),
                      datasets: [
                        {
                          label: 'Nombre d\'employés',
                          data: departmentChartData.map(d => d.value),
                          backgroundColor: 'rgba(59, 130, 246, 0.6)',
                          borderColor: 'rgb(59, 130, 246)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                    height={300}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Aucune donnée de département disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Statut des employés</CardTitle>
              <CardDescription>Distribution des employés par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <CustomPieChart
                  data={statusChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Hires */}
      <Card>
        <CardHeader>
          <CardTitle>Employés récemment embauchés</CardTitle>
          <CardDescription>Les 5 derniers employés enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Fonction</th>
                  <th className="px-4 py-2 text-left">Date d'embauche</th>
                  <th className="px-4 py-2 text-left">Département</th>
                </tr>
              </thead>
              <tbody>
                {recentHires.length > 0 ? (
                  recentHires.map((employee, index) => {
                    const deptName = departments?.find(d => d.id === employee.department || d.id === employee.departmentId)?.name || 'Non spécifié';
                    return (
                      <tr key={employee.id || index} className="border-b">
                        <td className="px-4 py-3">{`${employee.firstName || ''} ${employee.lastName || ''}`}</td>
                        <td className="px-4 py-3">{employee.position || employee.title || 'Non spécifié'}</td>
                        <td className="px-4 py-3">
                          {employee.hireDate 
                            ? new Date(employee.hireDate).toLocaleDateString('fr-FR') 
                            : 'Non spécifié'}
                        </td>
                        <td className="px-4 py-3">{deptName}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      Aucun employé récent trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesDashboardModule;
