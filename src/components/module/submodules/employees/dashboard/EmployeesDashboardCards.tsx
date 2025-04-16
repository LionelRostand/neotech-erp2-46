
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from '@/types/employee';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

interface EmployeesDashboardCardsProps {
  employees: Employee[];
}

const EmployeesDashboardCards: React.FC<EmployeesDashboardCardsProps> = ({ employees }) => {
  const total = employees.length;
  
  const active = employees.filter(employee => 
    employee.status === 'active' || employee.status === 'Actif'
  ).length;
  
  const inactive = employees.filter(employee => 
    employee.status === 'inactive' || employee.status === 'Inactif'
  ).length;
  
  const onLeave = employees.filter(employee => 
    employee.status === 'onLeave' || employee.status === 'En congé'
  ).length;
  
  const cards = [
    {
      title: "Total Employés",
      value: total,
      description: "Employés au total",
      icon: <Users className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Actifs",
      value: active,
      description: "Employés actifs",
      icon: <UserCheck className="h-8 w-8 text-green-500" />
    },
    {
      title: "Inactifs",
      value: inactive,
      description: "Employés inactifs",
      icon: <UserX className="h-8 w-8 text-red-500" />
    },
    {
      title: "En congé",
      value: onLeave,
      description: "Employés en congé",
      icon: <Clock className="h-8 w-8 text-amber-500" />
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmployeesDashboardCards;
