
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, Filter, CheckSquare, CheckCircle2, 
  Clock, AlertCircle, ArrowUpRight 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, Project } from './types/project-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, orderBy } from 'firebase/firestore';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const tasksCollection = useFirestore(COLLECTIONS.PROJECTS.TASKS);
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);
  
  // Fetch projects for the filter
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsCollection.getAll([orderBy('name', 'asc')]);
        setProjects(data as Project[]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Fetch tasks with filters
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const constraints = [];
        
        if (projectFilter !== 'all') {
          constraints.push(where('projectId', '==', projectFilter));
        }
        
        if (statusFilter !== 'all') {
          constraints.push(where('status', '==', statusFilter));
        }
        
        if (priorityFilter !== 'all') {
          constraints.push(where('priority', '==', priorityFilter));
        }
        
        // Always sort by due date
        constraints.push(orderBy('dueDate', 'asc'));
        
        const data = await tasksCollection.getAll(constraints);
        
        // Get project names
        const projectMap = new Map();
        projects.forEach(project => {
          projectMap.set(project.id, project.name);
        });
        
        // Process tasks
        const tasksWithProjectNames = data.map((doc: any) => {
          const task = {
            id: doc.id,
            projectId: doc.projectId || '',
            title: doc.title || '',
            description: doc.description || '',
            status: doc.status || 'todo',
            priority: doc.priority || 'medium',
            assignedTo: doc.assignedTo || [],
            dueDate: doc.dueDate || '',
            estimatedHours: doc.estimatedHours || 0,
            actualHours: doc.actualHours || 0,
            attachments: doc.attachments || [],
            createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : '',
            createdBy: doc.createdBy || '',
            projectName: projectMap.get(doc.projectId) || 'Projet inconnu'
          };
          return task;
        });
        
        setTasks(tasksWithProjectNames);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [projectFilter, statusFilter, priorityFilter, projects]);
  
  // Apply search filter client-side
  const filteredTasks = tasks.filter(task => {
    if (searchTerm) {
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.projectName && task.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });
  
  // Sort tasks into categories
  const today = new Date();
  const overdueTasks = filteredTasks.filter(task => 
    task.status !== 'completed' && isBefore(parseISO(task.dueDate), today)
  );
  
  const todayTasks = filteredTasks.filter(task => {
    const dueDate = parseISO(task.dueDate);
    return (
      task.status !== 'completed' && 
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });
  
  const upcomingTasks = filteredTasks.filter(task => 
    task.status !== 'completed' && isAfter(parseISO(task.dueDate), today) &&
    !todayTasks.includes(task)
  );
  
  const completedTasks = filteredTasks.filter(task => 
    task.status === 'completed'
  );
  
  const handleCreateTask = () => {
    setShowCreateDialog(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditDialog(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">À faire</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">En revue</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Haute</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Basse</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };
  
  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <div 
        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer mb-2"
        onClick={() => handleEditTask(task)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium">{task.title}</div>
          <div className="flex gap-1">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-gray-500">
          <div className="flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>{task.projectName}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Tâches</CardTitle>
            <CardDescription>Gestion et suivi des tâches</CardDescription>
          </div>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une tâche..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="review">En revue</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des tâches...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucune tâche trouvée</h3>
              <p className="mt-2 text-sm text-gray-500">
                Commencez par créer une nouvelle tâche ou ajustez vos filtres.
              </p>
              <Button className="mt-4" onClick={handleCreateTask}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle tâche
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="overdue" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>En retard ({overdueTasks.length})</span>
                </TabsTrigger>
                <TabsTrigger value="today" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Aujourd'hui ({todayTasks.length})</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>À venir ({upcomingTasks.length})</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Terminées ({completedTasks.length})</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overdue" className="mt-0">
                {overdueTasks.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg">
                    <p className="text-gray-500">Aucune tâche en retard</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {overdueTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="today" className="mt-0">
                {todayTasks.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg">
                    <p className="text-gray-500">Aucune tâche pour aujourd'hui</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {todayTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                {upcomingTasks.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg">
                    <p className="text-gray-500">Aucune tâche à venir</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {upcomingTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {completedTasks.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg">
                    <p className="text-gray-500">Aucune tâche terminée</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {completedTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {showCreateDialog && (
        <CreateTaskDialog 
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          projectId={projectFilter !== 'all' ? projectFilter : (projects.length > 0 ? projects[0].id : '')}
        />
      )}
      
      {showEditDialog && selectedTask && (
        <EditTaskDialog 
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default TasksPage;
