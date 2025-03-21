
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonReports } from '../hooks/useSalonReports';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SalesPerformanceTabProps {
  timeRange: string;
}

const SalesPerformanceTab: React.FC<SalesPerformanceTabProps> = ({ timeRange }) => {
  const { salesData, isLoading, error } = useSalonReports(timeRange);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500">Une erreur est survenue: {error.message}</div>;
  }
  
  if (!salesData) {
    return <div>Aucune donnée disponible</div>;
  }
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d'Affaires ({salesData.period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(salesData.revenue)}
            </div>
            <div className={`flex items-center mt-1 text-xs ${salesData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {salesData.growth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(salesData.growth)}% vs période précédente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Chiffre d'Affaires Mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}`,
                      'Revenu'
                    ]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Services les Plus Demandés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.serviceBreakdown}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'count') {
                        return [`${value} rendez-vous`, 'Rendez-vous'];
                      }
                      return [
                        `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}`,
                        'Revenu'
                      ];
                    }}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Répartition des services</div>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-2">Service</th>
                    <th className="pb-2 text-right">Rendez-vous</th>
                    <th className="pb-2 text-right">Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.serviceBreakdown.map((service, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{service.name}</td>
                      <td className="py-2 text-right">{service.count}</td>
                      <td className="py-2 text-right">{service.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance des Coiffeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={salesData.stylistPerformance}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => [
                      `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}`,
                      'Revenu'
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Détails par coiffeur</div>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-2">Coiffeur</th>
                    <th className="pb-2 text-right">Clients</th>
                    <th className="pb-2 text-right">CA</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.stylistPerformance.map((stylist, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{stylist.name}</td>
                      <td className="py-2 text-right">{stylist.clients}</td>
                      <td className="py-2 text-right">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stylist.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPerformanceTab;
