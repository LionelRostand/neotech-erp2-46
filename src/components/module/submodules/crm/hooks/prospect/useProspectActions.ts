
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Prospect, ProspectFormData } from '../../types/crm-types';

export const useProspectActions = (
  setProspects: React.Dispatch<React.SetStateAction<Prospect[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Add a new prospect
  const addProspect = useCallback(async (data: ProspectFormData): Promise<Prospect> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newProspect: Prospect = {
        id: Date.now().toString(),
        name: data.name || '',  // Ensure name is provided
        company: data.company,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        email: data.email || '',
        phone: data.phone || '',
        status: data.status as Prospect['status'],
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        size: data.size,
        estimatedValue: typeof data.estimatedValue === 'string' ? 
          parseFloat(data.estimatedValue) || 0 : 
          (data.estimatedValue || 0),
        notes: data.notes,
        createdAt: new Date().toISOString()
      };
      
      setProspects(prev => [newProspect, ...prev]);
      toast.success('Prospect ajouté avec succès');
      
      return newProspect;
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast.error('Erreur lors de l\'ajout du prospect');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setProspects, setIsLoading]);
  
  // Update an existing prospect
  const updateProspect = useCallback(async (id: string, data: Partial<ProspectFormData>): Promise<Prospect> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let updatedProspect: Prospect | undefined;
      
      setProspects(prev => {
        const updatedProspects = prev.map(prospect => {
          if (prospect.id === id) {
            updatedProspect = {
              ...prospect,
              ...data,
              // Handle estimatedValue conversion
              estimatedValue: typeof data.estimatedValue === 'string' ? 
                parseFloat(data.estimatedValue) || 0 : 
                (data.estimatedValue !== undefined ? data.estimatedValue : prospect.estimatedValue),
              status: (data.status as Prospect['status']) || prospect.status
            };
            return updatedProspect;
          }
          return prospect;
        });
        
        return updatedProspects;
      });
      
      toast.success('Prospect mis à jour avec succès');
      
      if (!updatedProspect) {
        throw new Error('Prospect not found');
      }
      
      return updatedProspect;
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast.error('Erreur lors de la mise à jour du prospect');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setProspects, setIsLoading]);
  
  // Delete a prospect
  const deleteProspect = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProspects(prev => prev.filter(prospect => prospect.id !== id));
      
      toast.success('Prospect supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error('Erreur lors de la suppression du prospect');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setProspects, setIsLoading]);
  
  // Convert prospect to client
  const convertToClient = useCallback(async (prospect: Prospect): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to create a client and update the prospect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the prospect to mark it as converted
      setProspects(prev => 
        prev.map(p => 
          p.id === prospect.id 
            ? { 
                ...p, 
                status: 'converted',
                convertedAt: new Date().toISOString(),
                convertedToClientId: 'client-' + Date.now() // In a real app, this would be the actual client ID
              } 
            : p
        )
      );
      
      toast.success('Prospect converti en client avec succès');
      return true;
    } catch (error) {
      console.error('Error converting prospect to client:', error);
      toast.error('Erreur lors de la conversion du prospect en client');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setProspects, setIsLoading]);
  
  // Add a reminder for a prospect
  const addReminder = useCallback(async (prospectId: string, reminderData: any): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Here you would typically save the reminder to your backend
      
      toast.success('Rappel ajouté avec succès');
      return true;
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Erreur lors de l\'ajout du rappel');
      throw error;
    }
  }, []);
  
  return {
    addProspect,
    updateProspect,
    deleteProspect,
    convertToClient,
    addReminder
  };
};
