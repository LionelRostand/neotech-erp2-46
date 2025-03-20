
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, User, DollarSign, Clock, 
  CheckSquare, Users, MessageSquare, AlertCircle
} from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Project, Task } from '../types/project-types';
import { TasksList } from './TasksList';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, orderBy } from 'firebase/firestore';

interface ProjectDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ 
  isOpen, 
  onClose,
  project 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tasksCollection = useFirestore(COLLECTIONS.PROJECTS.TASKS);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const constraints = [
          where('projectId', '==', project.id),
          orderBy('dueDate', 'asc')
        ];
        
        const data = await tasksCollection.getAll(constraints);
        
        const tasksData = data.map((doc: any) => ({
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
        }));
        
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [project.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'on-hold':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En pause</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
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

  // Count tasks by status
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const reviewCount = tasks.filter(t => t.status === 'review').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority)}
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Project details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Détails du projet</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Début:</span>
                    <span>{format(new Date(project.startDate), 'dd MMMM yyyy', { locale: fr })}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Échéance:</span>
                    <span>{format(new Date(project.endDate), 'dd MMMM yyyy', { locale: fr })}</span>
                  </div>
                  {project.client && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium mr-2">Client:</span>
                      <span>{project.client}</span>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium mr-2">Budget:</span>
                      <span>{project.budget.toLocaleString()} €</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Progression du projet</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Avancement global</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center p-2 rounded bg-gray-100">
                      <div className="text-lg font-medium">{todoCount}</div>
                      <div className="text-xs text-gray-500">À faire</div>
                    </div>
                    <div className="text-center p-2 rounded bg-blue-50">
                      <div className="text-lg font-medium">{inProgressCount}</div>
                      <div className="text-xs text-gray-500">En cours</div>
                    </div>
                    <div className="text-center p-2 rounded bg-purple-50">
                      <div className="text-lg font-medium">{reviewCount}</div>
                      <div className="text-xs text-gray-500">En revue</div>
                    </div>
                    <div className="text-center p-2 rounded bg-green-50">
                      <div className="text-lg font-medium">{completedCount}</div>
                      <div className="text-xs text-gray-500">Terminées</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {project.description && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-sm whitespace-pre-line text-gray-600">{project.description}</p>
              </div>
            )}
          </div>
          
          {/* Tabs for Tasks, Team, Comments */}
          <Tabs defaultValue="tasks">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                <span>Tâches</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Équipe</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Commentaires</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-4">
              <TasksList 
                tasks={tasks} 
                isLoading={isLoading} 
                projectId={project.id} 
              />
            </TabsContent>
            
            <TabsContent value="team" className="mt-4">
              <div className="text-center py-6 border rounded-lg">
                <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">La gestion d'équipe sera disponible prochainement</p>
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-4">
              <div className="text-center py-6 border rounded-lg">
                <MessageSquare className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Les commentaires seront disponibles prochainement</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
