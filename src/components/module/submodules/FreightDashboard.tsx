
import React, { useState } from 'react';
import { TrendingUp, Activity, Package, Truck, Clock, AlertTriangle, Calendar, DollarSign, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

const FreightDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('month');
  
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

  // Sample data for performance indicators
  const indicators = [
    { name: "Délai moyen de livraison", value: "4.2 jours", change: "-0.5j", positive: true },
    { name: "Taux de livraison à temps", value: "94%", change: "+2%", positive: true },
    { name: "Incidents signalés", value: "3", change: "-1", positive: true },
    { name: "Coût moyen par expédition", value: "327 €", change: "+12 €", positive: false }
  ];

  // Sample data for alerts
  const alerts = [
    { id: "ALT-001", shipment: "EXP-1026", type: "Retard", message: "Retard de livraison prévu de 2 jours", date: "2023-10-12", severity: "high" },
    { id: "ALT-002", shipment: "EXP-1032", type: "Anomalie", message: "Température conteneur hors plage autorisée", date: "2023-10-15", severity: "high" },
    { id: "ALT-003", shipment: "EXP-1029", type: "Document", message: "Document de douane manquant", date: "2023-10-14", severity: "medium" },
    { id: "ALT-004", shipment: "EXP-1027", type: "Information", message: "Changement d'itinéraire validé", date: "2023-10-13", severity: "low" },
  ];

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Statut des expéditions</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={dateRange === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('day')}
                >
                  Jour
                </Button>
                <Button
                  variant={dateRange === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('week')}
                >
                  Semaine
                </Button>
                <Button
                  variant={dateRange === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('month')}
                >
                  Mois
                </Button>
              </div>
            </div>
            <CardDescription>Répartition des statuts d'expédition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center flex flex-col items-center">
                <BarChart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-sm text-gray-500">
                  Graphique de répartition des statuts
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                  <div className="text-center">
                    <StatusBadge status="success">Livrées</StatusBadge>
                    <p className="text-2xl font-bold mt-2">62</p>
                  </div>
                  <div className="text-center">
                    <StatusBadge status="warning">En transit</StatusBadge>
                    <p className="text-2xl font-bold mt-2">45</p>
                  </div>
                  <div className="text-center">
                    <StatusBadge status="danger">Retardées</StatusBadge>
                    <p className="text-2xl font-bold mt-2">7</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
            <CardDescription>Indicateurs clés de performance logistique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {indicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {index === 0 && <Clock className="h-5 w-5 text-blue-500 mr-2" />}
                    {index === 1 && <Activity className="h-5 w-5 text-green-500 mr-2" />}
                    {index === 2 && <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />}
                    {index === 3 && <DollarSign className="h-5 w-5 text-purple-500 mr-2" />}
                    <span>{indicator.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{indicator.value}</span>
                    <span className={`text-xs ${indicator.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {indicator.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes et anomalies</CardTitle>
          <CardDescription>Suivi des événements anormaux nécessitant attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Expédition</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell>{alert.shipment}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={getAlertSeverityColor(alert.severity)}>
                      {alert.severity === 'high' ? 'Haute' : alert.severity === 'medium' ? 'Moyenne' : 'Basse'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Résoudre</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mb-8">
        <DataTable 
          title="Dernières Expéditions" 
          data={latestShipments} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expéditions à venir</CardTitle>
            <CardDescription>Prochaines expéditions planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center p-3 border rounded-md">
                  <Calendar className="h-10 w-10 text-blue-500 mr-4" />
                  <div className="flex-1">
                    <h3 className="font-medium">EXP-103{index + 5}</h3>
                    <p className="text-sm text-gray-500">Prévu pour le 2023-10-2{index}</p>
                  </div>
                  <Button variant="ghost" size="sm">Détails</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">Voir toutes les expéditions</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 pb-4">
                <p className="text-sm text-gray-500">Il y a 10 minutes</p>
                <p>Jean Dupont a créé une nouvelle expédition EXP-1035</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4 pb-4">
                <p className="text-sm text-gray-500">Il y a 30 minutes</p>
                <p>Marie Martin a confirmé la livraison de EXP-1029</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-4 pb-4">
                <p className="text-sm text-gray-500">Il y a 2 heures</p>
                <p>Pierre Dubois a modifié l'itinéraire de EXP-1030</p>
              </div>
              <div className="border-l-2 border-red-500 pl-4">
                <p className="text-sm text-gray-500">Il y a 4 heures</p>
                <p>Sophie Legrand a signalé un problème sur EXP-1026</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightDashboard;
