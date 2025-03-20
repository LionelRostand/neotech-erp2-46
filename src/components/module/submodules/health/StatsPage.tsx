
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  LineChart,
  Line
} from 'recharts';

// Données de démonstration pour les graphiques
const monthlyData = [
  { name: 'Jan', consultations: 40, hospitalisations: 24 },
  { name: 'Fév', consultations: 35, hospitalisations: 13 },
  { name: 'Mar', consultations: 50, hospitalisations: 22 },
  { name: 'Avr', consultations: 65, hospitalisations: 27 },
  { name: 'Mai', consultations: 60, hospitalisations: 25 },
  { name: 'Juin', consultations: 75, hospitalisations: 32 },
  { name: 'Juil', consultations: 85, hospitalisations: 28 },
  { name: 'Août', consultations: 80, hospitalisations: 30 },
  { name: 'Sep', consultations: 70, hospitalisations: 26 },
  { name: 'Oct', consultations: 65, hospitalisations: 24 },
  { name: 'Nov', consultations: 60, hospitalisations: 22 },
  { name: 'Déc', consultations: 55, hospitalisations: 20 },
];

const pathologiesData = [
  { name: 'Cardiologie', value: 30 },
  { name: 'Pédiatrie', value: 15 },
  { name: 'Orthopédie', value: 20 },
  { name: 'Dermatologie', value: 10 },
  { name: 'Neurologie', value: 15 },
  { name: 'Autres', value: 10 },
];

const occupationData = [
  { name: 'Lun', occupation: 75 },
  { name: 'Mar', occupation: 82 },
  { name: 'Mer', occupation: 86 },
  { name: 'Jeu', occupation: 90 },
  { name: 'Ven', occupation: 85 },
  { name: 'Sam', occupation: 70 },
  { name: 'Dim', occupation: 65 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const StatsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistiques et Rapports</h2>
      
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="consultations" fill="#4f46e5" name="Consultations" />
                    <Bar dataKey="hospitalisations" fill="#f97316" name="Hospitalisations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par pathologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pathologiesData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pathologiesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Taux d'occupation des chambres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={occupationData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="occupation" 
                        name="Taux d'occupation (%)" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Données financières</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Section en développement. Ici seront affichés les graphiques et tableaux concernant 
                les revenus, coûts, facturations et remboursements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des ressources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Section en développement. Ici seront affichés les graphiques et tableaux concernant 
                l'utilisation des ressources (personnel, équipements, chambres) et leur optimisation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPage;
