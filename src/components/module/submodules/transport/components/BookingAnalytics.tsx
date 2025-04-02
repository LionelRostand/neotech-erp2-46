
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, BarChart, PieChart, TrendingUp, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Données simulées pour les graphiques
const monthlyData = [
  { name: 'Jan', reservations: 65 },
  { name: 'Fév', reservations: 59 },
  { name: 'Mar', reservations: 80 },
  { name: 'Avr', reservations: 81 },
  { name: 'Mai', reservations: 56 },
  { name: 'Juin', reservations: 55 },
  { name: 'Juil', reservations: 40 },
  { name: 'Août', reservations: 70 },
  { name: 'Sep', reservations: 90 },
  { name: 'Oct', reservations: 110 },
  { name: 'Nov', reservations: 100 },
  { name: 'Déc', reservations: 120 },
];

const serviceTypeData = [
  { name: 'Standard', value: 400 },
  { name: 'Premium', value: 300 },
  { name: 'Van', value: 200 },
  { name: 'Minibus', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BookingAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Calcul des statistiques de base
  const totalBookings = monthlyData.reduce((acc, curr) => acc + curr.reservations, 0);
  const avgBookingsPerMonth = Math.round(totalBookings / monthlyData.length);
  const mostPopularMonth = [...monthlyData].sort((a, b) => b.reservations - a.reservations)[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mois le plus actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostPopularMonth.name}</div>
            <p className="text-xs text-muted-foreground">
              {mostPopularMonth.reservations} réservations
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgBookingsPerMonth}</div>
            <p className="text-xs text-muted-foreground">
              réservations par mois
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            <span>Services</span>
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Temporel</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Clients</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Réservations mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reservations" fill="#3b82f6" name="Réservations" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type de service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Analyse temporelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground">
                  Les statistiques détaillées par jour et heure seront disponibles prochainement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground">
                  Les statistiques détaillées sur les clients et leur fidélité seront disponibles prochainement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingAnalytics;
