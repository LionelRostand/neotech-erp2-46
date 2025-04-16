
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { Company } from '@/components/module/submodules/companies/types';
import CompaniesTable from '@/components/module/submodules/companies/CompaniesTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentTable from './DepartmentTable';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DepartmentsDashboard: React.FC = () => {
  const { departments, isLoading: departmentsLoading } = useFirebaseDepartments();
  const { companies, isLoading: companiesLoading } = useFirebaseCompanies();

  // Données pour le graphique
  const chartData = React.useMemo(() => {
    const data: any[] = [];
    departments.forEach(dept => {
      data.push({
        name: dept.name.length > 15 ? dept.name.substring(0, 15) + '...' : dept.name,
        'Nombre d\'employés': dept.employeesCount || 0
      });
    });
    return data;
  }, [departments]);

  // Trouver l'entreprise associée à un département
  const handleViewCompany = (company: Company) => {
    // Ici on pourrait implémenter une navigation vers la page de détails de l'entreprise
    console.log("Voir l'entreprise:", company);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord des Départements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Employés par Département</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Nombre d'employés" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Départements</h3>
                <p className="text-3xl font-bold">{departments.length}</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Entreprises</h3>
                <p className="text-3xl font-bold">{companies.length}</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Employés Total</h3>
                <p className="text-3xl font-bold">
                  {departments.reduce((total, dept) => total + (dept.employeesCount || 0), 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Managers</h3>
                <p className="text-3xl font-bold">
                  {departments.filter(dept => dept.managerId).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="departments" className="w-full">
        <TabsList>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="companies">Entreprises</TabsTrigger>
        </TabsList>
        <TabsContent value="departments">
          <Card>
            <CardContent className="p-6">
              <DepartmentTable 
                departments={departments}
                loading={departmentsLoading}
                onEditDepartment={() => {}}
                onDeleteDepartment={() => {}}
                onManageEmployees={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="companies">
          <Card>
            <CardContent className="p-6">
              <CompaniesTable
                companies={companies}
                isLoading={companiesLoading}
                onView={handleViewCompany}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentsDashboard;
