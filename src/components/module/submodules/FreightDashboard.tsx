
import React from 'react';
import { TrendingUp, Activity, Package, Truck } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';

const FreightDashboard: React.FC = () => {
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Chiffre du mois",
      value: "32,450 €",
      icon: <TrendingUp className="h-8 w-8 text-neotech-primary" />,
      description: "Total des expéditions du mois"
    },
    {
      title: "Activité",
      value: "+12%",
      icon: <Activity className="h-8 w-8 text-green-500" />,
      description: "Par rapport au mois précédent"
    },
    {
      title: "Total Colis",
      value: "215",
      icon: <Package className="h-8 w-8 text-amber-500" />,
      description: "Colis en transit ce mois"
    },
    {
      title: "Transporteurs",
      value: "12",
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs partenaires"
    }
  ];

  // Sample data for the latest shipments table
  const latestShipments: Transaction[] = [
    {
      id: "EXP-1030",
      date: "2023-10-15",
      client: "Acme Corp",
      amount: "3,245 €",
      status: "warning",
      statusText: "En transit"
    },
    {
      id: "EXP-1029",
      date: "2023-10-14",
      client: "Tech Solutions",
      amount: "5,680 €",
      status: "success",
      statusText: "Livré"
    },
    {
      id: "EXP-1028",
      date: "2023-10-14",
      client: "Global Logistics",
      amount: "2,350 €",
      status: "warning",
      statusText: "En transit"
    },
    {
      id: "EXP-1027",
      date: "2023-10-13",
      client: "Rapid Delivery",
      amount: "1,875 €",
      status: "success",
      statusText: "Livré"
    },
    {
      id: "EXP-1026",
      date: "2023-10-12",
      client: "Express Shipping",
      amount: "4,120 €",
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
          title="Dernières Expéditions" 
          data={latestShipments} 
        />
      </div>
    </>
  );
};

export default FreightDashboard;
