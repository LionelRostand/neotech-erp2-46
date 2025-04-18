
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeadcountByDepartment } from './reports/ReportComponents/HeadcountByDepartment';
import { MonthlyAbsence } from './reports/ReportComponents/MonthlyAbsence';
import { SeniorityChart } from './reports/ReportComponents/SeniorityChart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, UserCheck, Calendar } from 'lucide-react';

const reportComponents = [
  {
    id: 'headcount',
    title: 'Effectifs par département',
    description: 'Répartition des employés par département',
    icon: Users,
    component: HeadcountByDepartment
  },
  {
    id: 'absence',
    title: 'Absentéisme mensuel',
    description: 'Évolution mensuelle des absences',
    icon: UserCheck,
    component: MonthlyAbsence
  },
  {
    id: 'seniority',
    title: 'Ancienneté moyenne',
    description: 'Répartition de l\'ancienneté des employés',
    icon: Calendar,
    component: SeniorityChart
  }
];

const EmployeesReports = () => {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 space-y-6">
        <h2 className="text-3xl font-bold mb-6">Rapports RH</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportComponents.map((report) => {
            const ReportComponent = report.component;
            const Icon = report.icon;
            
            return (
              <Card key={report.id} className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span>{report.title}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="h-[300px] w-full">
                    <ReportComponent />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default EmployeesReports;
