
import React from 'react';
import { Badge, BadgeCheck, User } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';

const EmployeesBadges: React.FC = () => {
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Badges Actifs",
      value: "214",
      icon: <Badge className="h-8 w-8 text-neotech-primary" />,
      description: "Total des badges actuellement actifs"
    },
    {
      title: "Badges Attribués",
      value: "187",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Badges assignés à des employés"
    },
    {
      title: "Badges En Attente",
      value: "27",
      icon: <Badge className="h-8 w-8 text-amber-500" />,
      description: "Badges prêts à être attribués"
    },
    {
      title: "Employés",
      value: "175",
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Employés avec accès au système"
    }
  ];

  // Sample data for the transactions table
  const badgesData: Transaction[] = [
    {
      id: "B-2458",
      date: "2023-10-15",
      client: "Martin Dupont",
      amount: "Sécurité Niveau 3",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2457",
      date: "2023-10-14",
      client: "Sophie Martin",
      amount: "Administration",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2456",
      date: "2023-10-12",
      client: "Jean Lefebvre",
      amount: "IT",
      status: "warning",
      statusText: "En attente"
    },
    {
      id: "B-2455",
      date: "2023-10-10",
      client: "Emma Bernard",
      amount: "RH",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2454",
      date: "2023-10-09",
      client: "Thomas Petit",
      amount: "Marketing",
      status: "danger",
      statusText: "Désactivé"
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
          title="Registre des Badges" 
          data={badgesData} 
        />
      </div>
    </>
  );
};

export default EmployeesBadges;
