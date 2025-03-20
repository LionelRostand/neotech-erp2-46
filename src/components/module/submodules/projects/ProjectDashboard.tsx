
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, CheckCircle2, Clock, Layers, UserCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/StatCard";
import { ProjectStats } from './types/project-types';
import { useProjectStats } from './hooks/useProjectStats';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFetchProjects } from './hooks/useFetchProjects';
import { ProjectNotifications } from './components/ProjectNotifications';
import { UpcomingDeadlines } from './components/UpcomingDeadlines';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProjectDashboard = () => {
  const { projectStats, isLoading: statsLoading } = useProjectStats();
  const { projects, isLoading: projectsLoading } = useFetchProjects();
  
  const isLoading = statsLoading || projectsLoading;

  const progressData = projects?.slice(0, 5).map(project => ({
    name: project.name,
    progress: project.progress,
    priority: project.priority
  })) || [];

  const statusData = [
    { name: 'Actifs', value: projectStats?.activeProjects || 0 },
    { name: 'Terminés', value: projectStats?.completedProjects || 0 },
    { name: 'En attente', value: projects?.filter(p => p.status === 'on-hold').length || 0 },
    { name: 'Annulés', value: projects?.filter(p => p.status === 'cancelled').length || 0 },
  ];

  const workloadData = Object.entries(projectStats?.teamWorkload || {}).map(([name, value]) => ({
    name,
    tasks: value
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Projets actifs" 
          value={isLoading ? '...' : `${projectStats?.activeProjects}`} 
          icon={<Layers className="h-8 w-8 text-blue-500" />}
          description="Projets en cours actuellement"
        />
        <StatCard 
          title="Tâches en retard" 
          value={isLoading ? '...' : `${projectStats?.overdueTasks}`} 
          icon={<AlertCircle className="h-8 w-8 text-red-500" />}
          description="Tâches qui ont dépassé leur deadline"
        />
        <StatCard 
          title="Projets terminés" 
          value={isLoading ? '...' : `${projectStats?.completedProjects}`} 
          icon={<CheckCircle2 className="h-8 w-8 text-green-500" />}
          description="Projets complétés avec succès"
        />
        <StatCard 
          title="Deadlines proches" 
          value={isLoading ? '...' : `${projectStats?.upcomingDeadlines}`} 
          icon={<Calendar className="h-8 w-8 text-yellow-500" />}
          description="Échéances dans les 7 prochains jours"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progression des projets</CardTitle>
            <CardDescription>Avancement des 5 principaux projets</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Chargement des données...</p>
              </div>
            ) : (
              <ChartContainer className="h-[300px]" config={{}}>
                <BarChart data={progressData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" name="Progression (%)" fill="#3b82f6" />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des projets</CardTitle>
            <CardDescription>Répartition par état</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Chargement des données...</p>
              </div>
            ) : (
              <ChartContainer className="h-[300px]" config={{}}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
          <TabsTrigger value="upcoming">Échéances proches</TabsTrigger>
          <TabsTrigger value="workload">Charge de travail</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Échéances à venir
              </CardTitle>
              <CardDescription>Tâches et projets à livrer prochainement</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingDeadlines />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Charge de travail des équipes
              </CardTitle>
              <CardDescription>Répartition des tâches par équipe</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p>Chargement des données...</p>
                </div>
              ) : (
                <ChartContainer className="h-[300px]" config={{}}>
                  <BarChart data={workloadData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tasks" name="Nombre de tâches" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Mises à jour et notifications importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectNotifications />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
