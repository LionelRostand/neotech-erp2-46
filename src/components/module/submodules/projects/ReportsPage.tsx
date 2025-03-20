
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, CheckSquare, User, BarChart, 
  FileDown, Calendar, AlertCircle, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartContainer } from '@/components/ui/chart';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [taskStats, setTaskStats] = useState<any>(null);
  
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);
  const tasksCollection = useFirestore(COLLECTIONS.PROJECTS.TASKS);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all projects
        const projectsData = await projectsCollection.getAll();
        
        // Fetch all tasks
        const tasksData = await tasksCollection.getAll();
        
        // Calculate project stats
        const projects = projectsData as any[];
        const projectStatusData = [
          { name: 'Actifs', value: projects.filter(p => p.status === 'active').length },
          { name: 'En pause', value: projects.filter(p => p.status === 'on-hold').length },
          { name: 'Terminés', value: projects.filter(p => p.status === 'completed').length },
          { name: 'Annulés', value: projects.filter(p => p.status === 'cancelled').length },
        ];
        
        const projectPriorityData = [
          { name: 'Urgent', value: projects.filter(p => p.priority === 'urgent').length },
          { name: 'Haute', value: projects.filter(p => p.priority === 'high').length },
          { name: 'Moyenne', value: projects.filter(p => p.priority === 'medium').length },
          { name: 'Basse', value: projects.filter(p => p.priority === 'low').length },
        ];
        
        // Group project progress in ranges
        const progressRanges = [
          { name: '0-25%', value: projects.filter(p => p.progress <= 25).length },
          { name: '26-50%', value: projects.filter(p => p.progress > 25 && p.progress <= 50).length },
          { name: '51-75%', value: projects.filter(p => p.progress > 50 && p.progress <= 75).length },
          { name: '76-99%', value: projects.filter(p => p.progress > 75 && p.progress < 100).length },
          { name: '100%', value: projects.filter(p => p.progress === 100).length },
        ];
        
        setProjectStats({
          statusData: projectStatusData,
          priorityData: projectPriorityData,
          progressData: progressRanges
        });
        
        // Calculate task stats
        const tasks = tasksData as any[];
        const taskStatusData = [
          { name: 'À faire', value: tasks.filter(t => t.status === 'todo').length },
          { name: 'En cours', value: tasks.filter(t => t.status === 'in-progress').length },
          { name: 'En revue', value: tasks.filter(t => t.status === 'review').length },
          { name: 'Terminées', value: tasks.filter(t => t.status === 'completed').length },
        ];
        
        const taskPriorityData = [
          { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length },
          { name: 'Haute', value: tasks.filter(t => t.priority === 'high').length },
          { name: 'Moyenne', value: tasks.filter(t => t.priority === 'medium').length },
          { name: 'Basse', value: tasks.filter(t => t.priority === 'low').length },
        ];
        
        // Calculate metrics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        // Tasks by project (top 5)
        const tasksByProject = {};
        tasks.forEach(task => {
          if (!tasksByProject[task.projectId]) {
            tasksByProject[task.projectId] = 0;
          }
          tasksByProject[task.projectId]++;
        });
        
        // Sort and get top 5
        const topProjects = Object.entries(tasksByProject)
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 5)
          .map(([projectId, count]) => {
            const project = projects.find(p => p.id === projectId);
            return {
              name: project ? project.name : 'Projet inconnu',
              tasks: count
            };
          });
        
        setTaskStats({
          statusData: taskStatusData,
          priorityData: taskPriorityData,
          completionRate: completionRate.toFixed(1),
          totalTasks,
          completedTasks,
          topProjects
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Rapports</CardTitle>
            <CardDescription>Statistiques et analyses des projets</CardDescription>
          </div>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="projects" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Projets</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                <span>Tâches</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement des statistiques...</p>
                </div>
              ) : projectStats ? (
                <div className="space-y-6">
                  {/* Project stats overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">État des projets</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer className="h-[250px]" config={{}}>
                          <PieChart>
                            <Pie
                              data={projectStats.statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {projectStats.statusData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Priorité des projets</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer className="h-[250px]" config={{}}>
                          <PieChart>
                            <Pie
                              data={projectStats.priorityData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {projectStats.priorityData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Progression des projets</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer className="h-[250px]" config={{}}>
                          <RechartsBarChart data={projectStats.progressData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" name="Nombre de projets" fill="#8884d8" />
                          </RechartsBarChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Aucune donnée de projet disponible</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement des statistiques...</p>
                </div>
              ) : taskStats ? (
                <div className="space-y-6">
                  {/* Task completion metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-green-50 border-green-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">Taux de complétion</p>
                            <p className="text-3xl font-bold text-green-900">{taskStats.completionRate}%</p>
                          </div>
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-xs text-green-700 mt-2">
                          {taskStats.completedTasks} tâches terminées sur {taskStats.totalTasks}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50 border-blue-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">Tâches en cours</p>
                            <p className="text-3xl font-bold text-blue-900">
                              {taskStats.statusData.find((s: any) => s.name === 'En cours')?.value || 0}
                            </p>
                          </div>
                          <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                          Tâches actuellement en traitement
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-red-50 border-red-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-800">Tâches urgentes</p>
                            <p className="text-3xl font-bold text-red-900">
                              {taskStats.priorityData.find((p: any) => p.name === 'Urgent')?.value || 0}
                            </p>
                          </div>
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <p className="text-xs text-red-700 mt-2">
                          Tâches de priorité urgente à traiter
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Task status and project distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">État des tâches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer className="h-[300px]" config={{}}>
                          <PieChart>
                            <Pie
                              data={taskStats.statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {taskStats.statusData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Tâches par projet (Top 5)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer className="h-[300px]" config={{}}>
                          <RechartsBarChart data={taskStats.topProjects}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="tasks" name="Nombre de tâches" fill="#3b82f6" />
                          </RechartsBarChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Aucune donnée de tâche disponible</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
