
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Users, UserPlus, TrendingUp, Percent, Clock, Calendar, Mail, Phone, AlertCircle, RefreshCw } from "lucide-react";
import { useCrmDashboard } from './hooks/useCrmDashboard';
import StatCard from '@/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CrmDashboard: React.FC = () => {
  const { 
    stats, 
    salesData, 
    pipelineData,
    opportunitiesData, 
    recentActivities,
    isLoading,
    error,
    refreshData,
    COLORS
  } = useCrmDashboard();

  // Gérer le rafraîchissement des données
  const handleRefresh = () => {
    refreshData();
    toast.success('Actualisation des données en cours...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tableau de bord CRM</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      {/* Afficher les erreurs s'il y en a */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur lors du chargement des données</h3>
              <p className="text-sm text-red-700 mt-1">{error.message || 'Une erreur est survenue'}</p>
              {error.message?.includes('index') && (
                <p className="text-sm text-red-700 mt-2">
                  Cette erreur est liée à un index manquant dans Firestore. Veuillez suivre le lien dans le message d'erreur pour créer l'index requis.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Clients" 
          value={stats.clients.toString()} 
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Total des clients actifs" 
          loading={isLoading}
        />
        
        <StatCard 
          title="Prospects" 
          value={stats.prospects.toString()} 
          icon={<UserPlus className="h-6 w-6 text-green-600" />}
          description="Prospects à qualifier" 
          loading={isLoading}
        />
        
        <StatCard 
          title="Opportunités" 
          value={stats.opportunities.toString()} 
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          description="Affaires en cours" 
          loading={isLoading}
        />
        
        <StatCard 
          title="Taux de conversion" 
          value={`${stats.conversionRate}%`} 
          icon={<Percent className="h-6 w-6 text-amber-600" />}
          description="Prospects → Clients" 
          loading={isLoading}
        />
      </div>

      {/* Revenue & Pipeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <BarChartIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Performance des ventes</h3>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <ChartContainer className="h-64" config={{ data: { label: 'Ventes', theme: { light: '#60a5fa', dark: '#3b82f6' } } }}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-data)" />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>CA généré: <span className="font-medium text-foreground">{stats.revenueGenerated.toLocaleString('fr-FR')} €</span></p>
                <p>Montant moyen: <span className="font-medium text-foreground">{stats.averageDealSize.toLocaleString('fr-FR')} €</span></p>
              </div>
            </>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <PieChartIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium">Répartition des opportunités</h3>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-[260px] w-full rounded-md" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={opportunitiesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {opportunitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Pipeline Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Pipeline de Ventes</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {pipelineData.map((stage) => (
              <div key={stage.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{stage.name} ({stage.count})</span>
                  <span className="text-sm text-muted-foreground">{stage.percentage}%</span>
                </div>
                <Progress value={stage.percentage} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {activity.type === 'call' && <Phone className="h-4 w-4 mr-2 text-blue-600" />}
                    {activity.type === 'email' && <Mail className="h-4 w-4 mr-2 text-purple-600" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4 mr-2 text-green-600" />}
                    <span className="font-medium">{activity.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(activity.date), "d MMMM à HH:mm", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm mt-1">{activity.description}</p>
                <div className="mt-2 text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{activity.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500">
            <p>Aucune activité récente à afficher</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CrmDashboard;
