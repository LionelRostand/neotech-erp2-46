
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { ProjectStats, Project, Task } from '../types/project-types';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export const useProjectStats = () => {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);
  const tasksCollection = useFirestore(COLLECTIONS.PROJECTS.TASKS);
  const teamsCollection = useFirestore(COLLECTIONS.PROJECTS.TEAMS);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects
        const projectsData = await projectsCollection.getAll();
        const projects = projectsData as Project[];
        
        // Fetch tasks
        const tasksData = await tasksCollection.getAll();
        const tasks = tasksData as Task[];
        
        // Calculate stats
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        // Active and completed projects
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        
        // Overdue tasks
        const overdueTasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return task.status !== 'completed' && dueDate < today;
        }).length;
        
        // Upcoming deadlines
        const upcomingDeadlines = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return task.status !== 'completed' && dueDate >= today && dueDate <= nextWeek;
        }).length;
        
        // Team workload
        const teamWorkload: Record<string, number> = {};
        tasks.forEach(task => {
          task.assignedTo.forEach(memberId => {
            teamWorkload[memberId] = (teamWorkload[memberId] || 0) + 1;
          });
        });
        
        // Project progress
        const projectProgress: Record<string, number> = {};
        projects.forEach(project => {
          projectProgress[project.id] = project.progress;
        });
        
        setProjectStats({
          activeProjects,
          completedProjects,
          overdueTasks,
          upcomingDeadlines,
          teamWorkload,
          projectProgress
        });
      } catch (error) {
        console.error('Error fetching project stats:', error);
        toast.error('Impossible de charger les statistiques des projets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return { projectStats, isLoading };
};
