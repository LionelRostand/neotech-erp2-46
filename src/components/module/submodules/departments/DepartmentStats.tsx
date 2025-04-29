
import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, className }) => (
  <Card className={cn("overflow-hidden", className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface DepartmentStatsProps {
  departments: any[];
  employees: any[];
  loading?: boolean;
}

const DepartmentStats: React.FC<DepartmentStatsProps> = ({ departments, employees, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Sécuriser les tableaux
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
  // Calculs pour les statistiques
  const totalDepartments = safeDepartments.length;
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  
  // Calculer les employés actifs (ceux qui ont un département assigné)
  const employeesWithDepartments = safeEmployees.filter(emp => 
    emp.departmentId || emp.department
  );
  
  // Calculer les employés en congé
  const employeesOnLeave = safeEmployees.filter(emp => 
    emp.status === 'onLeave' || emp.status === 'En congé'
  );

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      <StatCard
        title="Départements du jour"
        value={formattedDate}
        description={`${totalDepartments} départements au total`}
        icon={<Calendar className="h-6 w-6" />}
        className="bg-blue-50"
      />
      <StatCard
        title="Départements actifs"
        value={totalDepartments}
        description="Départements en activité"
        icon={<Users className="h-6 w-6" />}
        className="bg-green-50"
      />
      <StatCard
        title="Employés affectés"
        value={employeesWithDepartments.length}
        description="Employés avec département"
        icon={<Users className="h-6 w-6" />}
        className="bg-yellow-50"
      />
      <StatCard
        title="Total des départements"
        value={totalDepartments}
        description="Structure de l'entreprise"
        icon={<Clock className="h-6 w-6" />}
        className="bg-purple-50"
      />
    </div>
  );
};

export default DepartmentStats;
