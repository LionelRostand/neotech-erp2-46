
import { useState, useEffect } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/use-firestore';
import { toast } from 'sonner';

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'; // Updated 'onHold' to 'on-hold'
  startDate: string;
  endDate?: string;
  budget?: number;
  manager?: string;
  team?: string[];
  priority: 'low' | 'medium' | 'high';
  progress: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Added missing field
  client?: string; // Added missing field
};

export const useFetchProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await projectsCollection.getAll();
        // Add default values for missing fields
        const enhancedData = data.map(project => ({
          ...project,
          createdBy: project.createdBy || 'user-1',
          client: project.client || 'N/A',
          // Convert 'onHold' to 'on-hold' if needed
          status: project.status === 'onHold' ? 'on-hold' : project.status
        }));
        setProjects(enhancedData as Project[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast.error('Impossible de charger les projets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [projectsCollection]);
  
  const refreshProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectsCollection.getAll();
      // Add default values for missing fields
      const enhancedData = data.map(project => ({
        ...project,
        createdBy: project.createdBy || 'user-1',
        client: project.client || 'N/A',
        // Convert 'onHold' to 'on-hold' if needed
        status: project.status === 'onHold' ? 'on-hold' : project.status
      }));
      setProjects(enhancedData as Project[]);
      setError(null);
      toast.success('Projets actualisés');
    } catch (err) {
      console.error('Error refreshing projects:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Impossible d\'actualiser les projets');
    } finally {
      setIsLoading(false);
    }
  };
  
  return { projects, isLoading, error, refreshProjects };
};
