
import React from 'react';
import { Users, Clock, CalendarDays, Building } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';

const EmployeesDashboard: React.FC = () => {
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Total Employés",
      value: "175",
      icon: <Users className="h-8 w-8 text-neotech-primary" />,
      description: "Employés actifs dans l'entreprise"
    },
    {
      title: "Présences",
      value: "156",
      icon: <Clock className="h-8 w-8 text-green-500" />,
      description: "Employés présents aujourd'hui"
    },
    {
      title: "Congés",
      value: "12",
      icon: <CalendarDays className="h-8 w-8 text-amber-500" />,
      description: "Employés en congés"
    },
    {
      title: "Départements",
      value: "8",
      icon: <Building className="h-8 w-8 text-blue-500" />,
      description: "Départements actifs"
    }
  ];

  // Sample data for the recent activities table
  const recentActivities: Transaction[] = [
    {
      id: "ACT-1024",
      date: "2023-10-15",
      client: "Martin Dupont",
      amount: "Arrivée",
      status: "success",
      statusText: "08:45"
    },
    {
      id: "ACT-1023",
      date: "2023-10-15",
      client: "Sophie Martin",
      amount: "Congé validé",
      status: "success",
      statusText: "Approuvé"
    },
    {
      id: "ACT-1022",
      date: "2023-10-15",
      client: "Jean Lefebvre",
      amount: "Badge",
      status: "warning",
      statusText: "En attente"
    },
    {
      id: "ACT-1021",
      date: "2023-10-14",
      client: "Emma Bernard",
      amount: "Formation",
      status: "success",
      statusText: "Terminée"
    },
    {
      id: "ACT-1020",
      date: "2023-10-14",
      client: "Thomas Petit",
      amount: "Évaluation",
      status: "danger",
      statusText: "À planifier"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <div className="mb-8">
        <DataTable 
          title="Activités Récentes" 
          data={recentActivities} 
        />
      </div>
    </>
  );
};

export default EmployeesDashboard;
