
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CarFront, Wrench, RotateCw, Fuel } from "lucide-react";
import StatCard from '@/components/StatCard';

interface VehiclePerformanceTabProps {
  timeRange: string;
}

// Mock data for vehicle utilization rates
const getUtilizationData = () => [
  { category: 'Citadine', utilisationRate: 78 },
  { category: 'Compacte', utilisationRate: 82 },
  { category: 'Berline', utilisationRate: 65 },
  { category: 'SUV', utilisationRate: 90 },
  { category: 'Premium', utilisationRate: 60 },
  { category: 'Utilitaire', utilisationRate: 85 },
];

// Mock data for maintenance metrics
const getMaintenanceData = () => [
  { name: 'Pannes', value: 12 },
  { name: 'Entretien', value: 45 },
  { name: 'Accidents', value: 8 },
  { name: 'Usure normale', value: 35 },
];

// Mock data for satisfaction metrics per vehicle type
const getSatisfactionData = () => [
  { 
    category: 'Citadine',
    confort: 4.1,
    proprete: 4.5,
    fiabilite: 4.2,
    rapport: 4.7,
    services: 4.0,
  },
  { 
    category: 'Compacte',
    confort: 4.3,
    proprete: 4.4,
    fiabilite: 4.3,
    rapport: 4.5,
    services: 4.2,
  },
  { 
    category: 'Berline',
    confort: 4.6,
    proprete: 4.3,
    fiabilite: 4.5,
    rapport: 4.1,
    services: 4.4,
  },
  { 
    category: 'SUV',
    confort: 4.8,
    proprete: 4.6,
    fiabilite: 4.4,
    rapport: 4.0,
    services: 4.5,
  },
  { 
    category: 'Premium',
    confort: 4.9,
    proprete: 4.7,
    fiabilite: 4.6,
    rapport: 3.9,
    services: 4.8,
  },
];

// Mock data for most rented vehicles
const getMostRentedVehicles = () => [
  { id: 1, model: 'Peugeot 208', category: 'Citadine', rentals: 45, revenue: 9800, rating: 4.7 },
  { id: 2, model: 'Renault Clio', category: 'Citadine', rentals: 38, revenue: 8200, rating: 4.5 },
  { id: 3, model: 'Toyota RAV4', category: 'SUV', rentals: 36, revenue: 12600, rating: 4.8 },
  { id: 4, model: 'Volkswagen Golf', category: 'Compacte', rentals: 32, revenue: 9500, rating: 4.6 },
  { id: 5, model: 'Citroën C3', category: 'Citadine', rentals: 30, revenue: 6400, rating: 4.4 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const VehiclePerformanceTab: React.FC<VehiclePerformanceTabProps> = ({ timeRange }) => {
  const utilizationData = getUtilizationData();
  const maintenanceData = getMaintenanceData();
  const satisfactionData = getSatisfactionData();
  const mostRentedVehicles = getMostRentedVehicles();
  
  // Calculate summary metrics
  const avgUtilizationRate = Math.round(
    utilizationData.reduce((sum, item) => sum + item.utilisationRate, 0) / utilizationData.length
  );
  const maintenanceEvents = maintenanceData.reduce((sum, item) => sum + item.value, 0);
  const avgSatisfaction = 4.5; // Mock value
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Taux d'utilisation"
          value={`${avgUtilizationRate}%`}
          icon={<RotateCw className="h-5 w-5 text-blue-500" />}
          description="Moyenne de la flotte"
        />
        <StatCard
          title="Maintenance"
          value={`${maintenanceEvents}`}
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          description="Interventions totales"
        />
        <StatCard
          title="Satisfaction"
          value={`${avgSatisfaction}/5`}
          icon={<CarFront className="h-5 w-5 text-green-500" />}
          description="Note moyenne"
        />
        <StatCard
          title="Consommation"
          value="6.8 L/100km"
          icon={<Fuel className="h-5 w-5 text-red-500" />}
          description="Moyenne de la flotte"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taux d'utilisation par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Taux d\'utilisation']}
                    labelFormatter={(label) => `Catégorie: ${label}`}
                  />
                  <Bar dataKey="utilisationRate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={maintenanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {maintenanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} interventions`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Véhicules les plus loués</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modèle</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Locations</TableHead>
                <TableHead className="text-right">Revenus</TableHead>
                <TableHead className="text-right">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostRentedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.model}</TableCell>
                  <TableCell>{vehicle.category}</TableCell>
                  <TableCell className="text-right">{vehicle.rentals}</TableCell>
                  <TableCell className="text-right">{formatCurrency(vehicle.revenue)}</TableCell>
                  <TableCell className="text-right">{vehicle.rating}/5</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehiclePerformanceTab;
