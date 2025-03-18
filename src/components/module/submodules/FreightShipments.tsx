
import React from 'react';
import { Badge, BadgeCheck, User } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';

const FreightShipments: React.FC = () => {
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Expéditions",
      value: "124",
      icon: <Badge className="h-8 w-8 text-neotech-primary" />,
      description: "Expéditions en cours"
    },
    {
      title: "Livraisons",
      value: "87",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Livraisons effectuées ce mois"
    },
    {
      title: "En attente",
      value: "36",
      icon: <Badge className="h-8 w-8 text-amber-500" />,
      description: "Expéditions en attente"
    },
    {
      title: "Transporteurs",
      value: "12",
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs actifs"
    }
  ];

  // Sample data for the transactions table
  const shipmentsData: Transaction[] = [
    {
      id: "EXP-1024",
      date: "2023-10-15",
      client: "Logistique Express",
      amount: "2,458 €",
      status: "success",
      statusText: "Livré"
    },
    {
      id: "EXP-1023",
      date: "2023-10-14",
      client: "TransportPlus",
      amount: "1,875 €",
      status: "warning",
      statusText: "En transit"
    },
    {
      id: "EXP-1022",
      date: "2023-10-12",
      client: "Cargo International",
      amount: "3,214 €",
      status: "warning",
      statusText: "En transit"
    },
    {
      id: "EXP-1021",
      date: "2023-10-10",
      client: "MariTrans",
      amount: "5,680 €",
      status: "success",
      statusText: "Livré"
    },
    {
      id: "EXP-1020",
      date: "2023-10-09",
      client: "AirCargo",
      amount: "2,950 €",
      status: "danger",
      statusText: "Retardé"
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
          title="Suivi des Expéditions" 
          data={shipmentsData} 
        />
      </div>
    </>
  );
};

export default FreightShipments;
