
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  LineChart, 
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données simulées pour les graphiques
const reservationData = [
  { date: '2023-07-01', reservations: 5, completed: 4, cancelled: 1 },
  { date: '2023-07-02', reservations: 7, completed: 6, cancelled: 1 },
  { date: '2023-07-03', reservations: 3, completed: 3, cancelled: 0 },
  { date: '2023-07-04', reservations: 8, completed: 7, cancelled: 1 },
  { date: '2023-07-05', reservations: 12, completed: 10, cancelled: 2 },
  { date: '2023-07-06', reservations: 6, completed: 5, cancelled: 1 },
  { date: '2023-07-07', reservations: 9, completed: 8, cancelled: 1 },
  { date: '2023-07-08', reservations: 11, completed: 9, cancelled: 2 },
  { date: '2023-07-09', reservations: 14, completed: 12, cancelled: 2 },
  { date: '2023-07-10', reservations: 16, completed: 14, cancelled: 2 },
  { date: '2023-07-11', reservations: 13, completed: 11, cancelled: 2 },
  { date: '2023-07-12', reservations: 12, completed: 10, cancelled: 2 },
  { date: '2023-07-13', reservations: 15, completed: 13, cancelled: 2 },
  { date: '2023-07-14', reservations: 18, completed: 16, cancelled: 2 },
];

const serviceData = [
  { name: "Transfert aéroport", value: 48 },
  { name: "Location journée", value: 27 },
  { name: "Visite touristique", value: 16 },
  { name: "Transfert gare", value: 9 },
];

const sourceData = [
  { name: "Site web", value: 53 },
  { name: "Application mobile", value: 32 },
  { name: "Téléphone", value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  change?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, description, change }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {change !== undefined && (
          <span className={`ml-2 text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? `+${change}%` : `${change}%`}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const BookingAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  // Format une date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM", { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Statistiques de réservation</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionnez une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
            <SelectItem value="quarter">3 derniers mois</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total des réservations"
          value="142"
          description="Depuis le début du mois"
          change={8.2}
        />
        <KPICard
          title="Réservations complétées"
          value="124"
          description="87% du total des réservations"
          change={5.1}
        />
        <KPICard
          title="Taux de conversion"
          value="12.8%"
          description="Visiteurs qui réservent"
          change={2.3}
        />
        <KPICard
          title="Valeur moyenne"
          value="78€"
          description="Par réservation"
          change={-1.5}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reservationData}>
                    <defs>
                      <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} réservations`, 'Total']}
                      labelFormatter={(label) => formatDate(label as string)}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reservations" 
                      stroke="#1E40AF" 
                      fillOpacity={1} 
                      fill="url(#colorReservations)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Réservations complétées vs annulées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reservationData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                          />
                          <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              const label = name === 'completed' ? 'Complétées' : 'Annulées';
                              return [`${value}`, label];
                            }}
                            labelFormatter={(label) => formatDate(label as string)}
                          />
                          <Bar dataKey="completed" name="Complétées" stackId="a" fill="#4C1D95" />
                          <Bar dataKey="cancelled" name="Annulées" stackId="a" fill="#F87171" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Distribution par service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={serviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {serviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}`, 'Réservations']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={150} />
                    <Tooltip formatter={(value) => [`${value} réservations`, 'Total']} />
                    <Bar dataKey="value" name="Réservations" fill="#4C1D95" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-medium mb-4">Détail des services</h4>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Service</th>
                      <th className="text-right py-2 font-medium">Réservations</th>
                      <th className="text-right py-2 font-medium">% du total</th>
                      <th className="text-right py-2 font-medium">CA généré</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Transfert aéroport</td>
                      <td className="text-right py-3">48</td>
                      <td className="text-right py-3">48%</td>
                      <td className="text-right py-3">2 400€</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Location journée</td>
                      <td className="text-right py-3">27</td>
                      <td className="text-right py-3">27%</td>
                      <td className="text-right py-3">3 240€</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Visite touristique</td>
                      <td className="text-right py-3">16</td>
                      <td className="text-right py-3">16%</td>
                      <td className="text-right py-3">1 280€</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Transfert gare</td>
                      <td className="text-right py-3">9</td>
                      <td className="text-right py-3">9%</td>
                      <td className="text-right py-3">360€</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="text-left py-3 font-medium">Total</th>
                      <th className="text-right py-3 font-medium">100</th>
                      <th className="text-right py-3 font-medium">100%</th>
                      <th className="text-right py-3 font-medium">7 280€</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Sources de réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}`, 'Réservations']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Détail des sources</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Source</th>
                        <th className="text-right py-2 font-medium">Réservations</th>
                        <th className="text-right py-2 font-medium">% du total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">Site web</td>
                        <td className="text-right py-3">53</td>
                        <td className="text-right py-3">53%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Application mobile</td>
                        <td className="text-right py-3">32</td>
                        <td className="text-right py-3">32%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Téléphone</td>
                        <td className="text-right py-3">15</td>
                        <td className="text-right py-3">15%</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th className="text-left py-3 font-medium">Total</th>
                        <th className="text-right py-3 font-medium">100</th>
                        <th className="text-right py-3 font-medium">100%</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-medium mb-4">Parcours de réservation</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Vues', value: 1000 },
                        { name: 'Clics', value: 420 },
                        { name: 'Formulaires', value: 180 },
                        { name: 'Réservations', value: 100 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value}`, 'Nombre']} />
                      <Bar dataKey="value" fill="#1E40AF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Taux de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '2023-07-01', rate: 8.2 },
                    { date: '2023-07-02', rate: 8.5 },
                    { date: '2023-07-03', rate: 9.1 },
                    { date: '2023-07-04', rate: 10.2 },
                    { date: '2023-07-05', rate: 11.5 },
                    { date: '2023-07-06', rate: 12.3 },
                    { date: '2023-07-07', rate: 11.8 },
                    { date: '2023-07-08', rate: 12.5 },
                    { date: '2023-07-09', rate: 13.1 },
                    { date: '2023-07-10', rate: 14.2 },
                    { date: '2023-07-11', rate: 13.5 },
                    { date: '2023-07-12', rate: 12.8 },
                    { date: '2023-07-13', rate: 13.2 },
                    { date: '2023-07-14', rate: 12.8 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      domain={[0, 20]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Taux de conversion']}
                      labelFormatter={(label) => formatDate(label as string)}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#4C1D95"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Points d'abandon</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Étape</th>
                        <th className="text-right py-2 font-medium">Taux d'abandon</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">Choix du service</td>
                        <td className="text-right py-3">32%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Saisie des informations personnelles</td>
                        <td className="text-right py-3">48%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Paiement</td>
                        <td className="text-right py-3">12%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Confirmation</td>
                        <td className="text-right py-3">8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Suggestions d'amélioration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>Simplifier le formulaire d'information personnelle pour réduire le taux d'abandon de 48%</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>Ajouter des photos plus détaillées des services pour améliorer l'étape de sélection</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>Implémenter un système de rappel par email pour les réservations abandonnées</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span>Ajouter des témoignages clients sur la page de réservation pour renforcer la confiance</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingAnalytics;
