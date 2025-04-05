
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { useCrmData } from '@/hooks/modules/useCrmData';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart,
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const CrmAnalytics: React.FC = () => {
  const { clients, prospects, opportunities, isLoading } = useCrmData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Generate some analytics data
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fév', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Avr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  // Conversion stages data
  const conversionData = [
    { name: 'Prospect', count: prospects?.length || 0 },
    { name: 'Négociation', count: opportunities?.filter(o => o?.stage === 'negotiation')?.length || 0 },
    { name: 'Proposition', count: opportunities?.filter(o => o?.stage === 'proposal')?.length || 0 },
    { name: 'Client', count: clients?.length || 0 },
  ];

  // Status distribution
  const statusDistribution = [
    { name: 'Actif', value: clients?.filter(c => c?.status === 'active')?.length || 0 },
    { name: 'Inactif', value: clients?.filter(c => c?.status === 'inactive')?.length || 0 },
    { name: 'En pause', value: clients?.filter(c => c?.status === 'paused')?.length || 0 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytiques CRM</h2>
        <Card className="p-6">
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytiques CRM</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <BarChart className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Performance des ventes</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Ventes" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <LineChart className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-medium">Taux de conversion</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                activeDot={{ r: 8 }} 
                name="Nombre"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center mb-6">
          <PieChart className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="font-medium">Distribution par statut</h3>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default CrmAnalytics;
