
import React from 'react';
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { LineChart } from '@/components/ui/line-chart';

const GarageMaintenanceDashboard = () => {
  const { maintenances = [], vehicles = [], mechanics = [], clients = [], isLoading } = useGarageData();

  const getTodayMaintenances = () => maintenances.filter(m => 
    format(new Date(m.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;

  const getInProgressMaintenances = () => maintenances.filter(m => 
    m.status === 'in_progress'
  ).length;

  const getCompletedMaintenances = () => maintenances.filter(m => 
    m.status === 'completed'
  ).length;

  const getPendingMaintenances = () => maintenances.filter(m => 
    m.status === 'pending'
  ).length;

  // Colonnes pour le tableau des maintenances récentes
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'dd MMMM yyyy', { locale: fr })
    },
    {
      accessorKey: 'vehicleId',
      header: 'Véhicule',
      cell: ({ row }) => {
        const vehicle = vehicles.find(v => v.id === row.original.vehicleId);
        return vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A';
      }
    },
    {
      accessorKey: 'clientId',
      header: 'Client',
      cell: ({ row }) => {
        const client = clients.find(c => c.id === row.original.clientId);
        return client ? `${client.firstName} ${client.lastName}` : 'N/A';
      }
    },
    {
      accessorKey: 'mechanicId',
      header: 'Mécanicien',
      cell: ({ row }) => {
        const mechanic = mechanics.find(m => m.id === row.original.mechanicId);
        return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'N/A';
      }
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap = {
          pending: 'En attente',
          in_progress: 'En cours',
          completed: 'Terminée',
          cancelled: 'Annulée'
        };
        return statusMap[status as keyof typeof statusMap] || status;
      }
    }
  ];

  // Données pour le graphique des maintenances par mois
  const maintenancesByMonth = maintenances.reduce((acc: any[], maintenance) => {
    const month = format(new Date(maintenance.date), 'MMMM', { locale: fr });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Maintenances aujourd'hui"
          value={getTodayMaintenances().toString()}
          icon={<Clock className="h-4 w-4" />}
          description="Programmées ce jour"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En cours"
          value={getInProgressMaintenances().toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Maintenances en cours"
          className="bg-yellow-50 hover:bg-yellow-100"
        />
        <StatCard
          title="Terminées"
          value={getCompletedMaintenances().toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Maintenances complétées"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="En attente"
          value={getPendingMaintenances().toString()}
          icon={<AlertCircle className="h-4 w-4" />}
          description="À traiter"
          className="bg-red-50 hover:bg-red-100"
        />
      </div>

      {/* Graphique des maintenances par mois */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Évolution des maintenances</h2>
        <div className="h-[300px]">
          <LineChart
            data={maintenancesByMonth}
            xKey="month"
            yKey="count"
            color="#0284c7"
          />
        </div>
      </Card>

      {/* Tableau des maintenances récentes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Maintenances récentes</h2>
        <DataTable
          columns={columns}
          data={maintenances.slice(0, 5)}
        />
      </Card>
    </div>
  );
};

export default GarageMaintenanceDashboard;
