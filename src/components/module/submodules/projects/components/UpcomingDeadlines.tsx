
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Task, Project } from '../types/project-types';
import { Timestamp } from 'firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarCheck, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const UpcomingDeadlines = () => {
  const [tasks, setTasks] = useState<(Task & { projectName?: string })[]>([]);
  const [projects, setProjects] = useState<(Project & { remainingDays?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tasksCollection = useFirestore(COLLECTIONS.PROJECTS.TASKS);
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setIsLoading(true);
        
        // Get today and next 7 days
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 14); // 2 weeks ahead
        
        // Convert to ISO string for comparison
        const todayStr = today.toISOString().split('T')[0];
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        
        // Fetch upcoming tasks
        const tasksConstraints = [
          where('status', '!=', 'completed'),
          where('dueDate', '>=', todayStr),
          where('dueDate', '<=', nextWeekStr),
          orderBy('dueDate', 'asc')
        ];
        
        const tasksData = await tasksCollection.getAll(tasksConstraints);
        
        // Fetch upcoming project deadlines
        const projectsConstraints = [
          where('status', '!=', 'completed'),
          where('endDate', '>=', todayStr),
          where('endDate', '<=', nextWeekStr),
          orderBy('endDate', 'asc')
        ];
        
        const projectsData = await projectsCollection.getAll(projectsConstraints);
        
        // Get all projects to get names for tasks
        const allProjects = await projectsCollection.getAll();
        const projectsMap = new Map();
        allProjects.forEach((project: any) => {
          projectsMap.set(project.id, project.name);
        });
        
        // Process tasks
        const processedTasks = tasksData.map((doc: any) => {
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
            projectName: projectsMap.get(doc.projectId) || 'Projet inconnu'
          };
          return task;
        });
        
        // Process projects
        const processedProjects = projectsData.map((doc: any) => {
          const endDate = new Date(doc.endDate);
          const diffTime = Math.abs(endDate.getTime() - today.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            id: doc.id,
            name: doc.name || '',
            description: doc.description || '',
            startDate: doc.startDate || '',
            endDate: doc.endDate || '',
            status: doc.status || 'active',
            priority: doc.priority || 'medium',
            budget: doc.budget || 0,
            client: doc.client || '',
            progress: doc.progress || 0,
            teamId: doc.teamId || '',
            createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : '',
            createdBy: doc.createdBy || '',
            remainingDays: diffDays
          };
        });
        
        setTasks(processedTasks.slice(0, 5)); // Show only first 5
        setProjects(processedProjects.slice(0, 3)); // Show only first 3
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeadlines();
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Haute</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Basse</Badge>;
      default:
        return <Badge variant="outline">Normale</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement des échéances...</div>;
  }

  if (tasks.length === 0 && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <CalendarCheck className="h-10 w-10 mb-4 opacity-20" />
        <p>Aucune échéance dans les 14 prochains jours</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            Projets à livrer bientôt
          </h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="flex p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="mr-3 flex-shrink-0 flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center font-medium">
                    {project.remainingDays}j
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Échéance: {format(new Date(project.endDate), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </div>
                    <div className="ml-2">
                      {getPriorityBadge(project.priority)}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600 text-xs">Progression: {project.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Tâches à compléter
          </h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Projet: {task.projectName}
                      </div>
                    </div>
                    <div className="ml-2">
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-600 text-xs">
                      Échéance: {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
