
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Project } from '../types/project-types';
import { where, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

export const useFetchProjects = (filters?: any) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        
        // Build query constraints
        const constraints = [];
        
        if (filters?.status) {
          constraints.push(where('status', '==', filters.status));
        }
        
        if (filters?.priority) {
          constraints.push(where('priority', '==', filters.priority));
        }
        
        // Always sort by updatedAt
        constraints.push(orderBy('updatedAt', 'desc'));
        
        const data = await projectsCollection.getAll(constraints);
        
        // Transform to Project objects
        const projectsData = data.map((doc: any) => ({
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
        }));
        
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Impossible de charger les projets');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [filters]);
  
  return { projects, isLoading };
};
