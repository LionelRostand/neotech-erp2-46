
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDate } from '@/lib/utils';
import LineChart from '@/components/ui/line-chart';
import { Wrench, DollarSign, Calendar } from 'lucide-react';
import StatCard from '@/components/StatCard';

const MaintenanceDashboard = () => {
  const { 
    maintenances = [], 
    isLoading 
  } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Calculate statistics
  const totalMaintenances = maintenances.length;
  const totalRevenue = maintenances.reduce((sum, m) => sum + (m.totalCost || 0), 0);
  const averageCost = totalMaintenances > 0 ? totalRevenue / totalMaintenances : 0;

  // Prepare data for line chart (maintenance costs per month)
  const monthlyCostsData = maintenances.reduce((acc, maintenance) => {
    const month = new Date(maintenance.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.cost += maintenance.totalCost || 0;
    } else {
      acc.push({ month, cost: maintenance.totalCost || 0 });
    }
    
    return acc;
  }, [] as { month: string; cost: number }[]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Maintenances totales"
          value={totalMaintenances.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Nombre de maintenances"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="Revenus des maintenances"
          value={`${totalRevenue.toFixed(2)}€`}
          icon={<DollarSign className="h-4 w-4" />}
          description="Revenu total généré"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="Coût moyen"
          value={`${averageCost.toFixed(2)}€`}
          icon={<Calendar className="h-4 w-4" />}
          description="Coût moyen par maintenance"
          className="bg-purple-50 hover:bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus des maintenances par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={monthlyCostsData} 
              xKey="month" 
              yKey="cost" 
              title="Revenus mensuels" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières maintenances</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Coût</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenances
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell>{formatDate(maintenance.date)}</TableCell>
                      <TableCell>{maintenance.vehicleId}</TableCell>
                      <TableCell>{maintenance.totalCost}€</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
