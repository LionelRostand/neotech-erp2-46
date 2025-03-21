
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonReports } from '../hooks/useSalonReports';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { LucideUser, Clock, CalendarCheck, CalendarX } from 'lucide-react';

interface AppointmentsClientsTabProps {
  timeRange: string;
}

const AppointmentsClientsTab: React.FC<AppointmentsClientsTabProps> = ({ timeRange }) => {
  const { appointmentsData, isLoading, error } = useSalonReports(timeRange);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500">Une erreur est survenue: {error.message}</div>;
  }
  
  if (!appointmentsData) {
    return <div>Aucune donnée disponible</div>;
  }
  
  const appointmentStatusData = [
    { name: 'Complétés', value: appointmentsData.completed },
    { name: 'Annulés', value: appointmentsData.cancelled },
    { name: 'Non présentés', value: appointmentsData.noShow }
  ];
  
  const COLORS = ['#82ca9d', '#ffc658', '#ff8042'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <CalendarCheck className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{appointmentsData.total}</div>
              <div className="text-sm text-muted-foreground">Rendez-vous totaux</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <LucideUser className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold">{appointmentsData.newClients}</div>
              <div className="text-sm text-muted-foreground">Nouveaux clients</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <CalendarX className="h-8 w-8 text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{appointmentsData.cancelled + appointmentsData.noShow}</div>
              <div className="text-sm text-muted-foreground">Annulés / Absents</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <LucideUser className="h-8 w-8 text-indigo-500 mb-2" />
              <div className="text-2xl font-bold">{appointmentsData.activeClients}</div>
              <div className="text-sm text-muted-foreground">Clients actifs</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statut des Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} rendez-vous`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-1">
                  {Math.round((appointmentsData.completed / appointmentsData.total) * 100)}%
                </Badge>
                <div className="text-xs text-center">Complétés</div>
              </div>
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 mb-1">
                  {Math.round((appointmentsData.cancelled / appointmentsData.total) * 100)}%
                </Badge>
                <div className="text-xs text-center">Annulés</div>
              </div>
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 mb-1">
                  {Math.round((appointmentsData.noShow / appointmentsData.total) * 100)}%
                </Badge>
                <div className="text-xs text-center">Non présentés</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentsData.appointmentsOverTime}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} rendez-vous`, 'Rendez-vous']} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium">Horaires les plus demandés:</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {appointmentsData.mostPopularTimes.map((time, index) => (
                  <Badge key={index} variant="secondary" className="flex gap-1 items-center">
                    <Clock className="h-3 w-3" /> {time.time} ({time.count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fidélité Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={appointmentsData.clientsOverTime}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      return [`${value} clients`, name === 'new' ? 'Nouveaux' : 'Fidèles'];
                    }} />
                    <Area type="monotone" dataKey="returning" stackId="1" stroke="#8884d8" fill="#8884d8" name="Fidèles" />
                    <Area type="monotone" dataKey="new" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Nouveaux" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Taux de rétention</div>
                  <div className="text-2xl font-bold mt-1">{appointmentsData.clientRetention}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${appointmentsData.clientRetention}%` }}></div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Nouveaux clients</div>
                    <div className="text-xl font-bold mt-1">{appointmentsData.newClients}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Clients fidèles</div>
                    <div className="text-xl font-bold mt-1">{appointmentsData.returningClients}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Ratio nouveaux / fidèles</div>
                  <div className="text-xl font-bold mt-1">
                    1:{Math.round(appointmentsData.returningClients / appointmentsData.newClients)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsClientsTab;
