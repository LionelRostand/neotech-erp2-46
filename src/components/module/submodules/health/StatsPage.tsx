
import React, { useState } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const StatsPage: React.FC = () => {
  const { 
    patients, 
    appointments, 
    consultations, 
    prescriptions, 
    billing,
    doctors,
    isLoading 
  } = useHealthData();
  
  const [timeFrame, setTimeFrame] = useState('month');

  // Mock data for patient statistics
  const patientStats = [
    { name: 'Jan', count: 15 },
    { name: 'Fév', count: 10 },
    { name: 'Mar', count: 8 },
    { name: 'Avr', count: 12 },
    { name: 'Mai', count: 16 },
    { name: 'Juin', count: 9 },
  ];

  // Mock data for consultation statistics
  const consultationStats = [
    { name: 'Consultation', count: consultations?.length || 25 },
    { name: 'Suivi', count: consultations?.filter(c => c.consultationType === 'follow-up')?.length || 15 },
    { name: 'Urgence', count: consultations?.filter(c => c.consultationType === 'emergency')?.length || 5 },
  ];

  // Pie chart data
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Diagnoses data
  const diagnosesData = [
    { name: 'Rhume', value: 20 },
    { name: 'Fracture', value: 15 },
    { name: 'Allergies', value: 12 },
    { name: 'Entorse', value: 8 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Statistiques
        </h1>
        
        <ToggleGroup type="single" value={timeFrame} onValueChange={(value) => value && setTimeFrame(value)}>
          <ToggleGroupItem value="week">Semaine</ToggleGroupItem>
          <ToggleGroupItem value="month">Mois</ToggleGroupItem>
          <ToggleGroupItem value="year">Année</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total des patients enregistrés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total des consultations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médecins</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 6h13" />
              <path d="M8 12h13" />
              <path d="M8 18h13" />
              <path d="M3 6h.01" />
              <path d="M3 12h.01" />
              <path d="M3 18h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total des médecins</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billing?.reduce((sum, inv) => sum + inv.total, 0).toFixed(2) || "0.00"} €
            </div>
            <p className="text-xs text-muted-foreground">Revenu total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Nouveaux patients par mois</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={patientStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="consultations" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Types de consultations</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={consultationStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Consultations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="diagnoses" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Diagnostics les plus fréquents</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diagnosesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diagnosesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPage;
