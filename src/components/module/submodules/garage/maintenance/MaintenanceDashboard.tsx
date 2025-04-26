
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, LineChart } from '@/components/ui/charts';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MaintenanceDashboard = () => {
  const { maintenances = [], isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Calculer les statistiques
  const totalMaintenances = maintenances.length;
  const totalRevenue = maintenances.reduce((sum, m) => sum + m.totalCost, 0);
  const averageCost = totalMaintenances > 0 ? totalRevenue / totalMaintenances : 0;

  // Données pour le graphique des coûts par mois
  const maintenancesByMonth = maintenances.reduce((acc: any, maintenance) => {
    const monthYear = format(new Date(maintenance.date), 'MMM yyyy', { locale: fr });
    acc[monthYear] = (acc[monthYear] || 0) + maintenance.totalCost;
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(maintenancesByMonth),
    datasets: [{
      label: 'Coût total des maintenances',
      data: Object.values(maintenancesByMonth),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Données pour le graphique des statuts
  const statusCount = maintenances.reduce((acc: any, maintenance) => {
    acc[maintenance.status] = (acc[maintenance.status] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(statusCount),
    datasets: [{
      label: 'Nombre de maintenances',
      data: Object.values(statusCount),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord des maintenances</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Maintenances</h3>
          <p className="text-2xl font-bold">{totalMaintenances}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Revenu Total</h3>
          <p className="text-2xl font-bold">{totalRevenue.toFixed(2)}€</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Coût Moyen</h3>
          <p className="text-2xl font-bold">{averageCost.toFixed(2)}€</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Coûts par mois</h3>
          <div className="h-[300px]">
            <LineChart data={lineChartData} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Statuts des maintenances</h3>
          <div className="h-[300px]">
            <BarChart data={barChartData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
