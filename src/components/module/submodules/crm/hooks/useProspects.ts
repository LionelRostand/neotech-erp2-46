
import { useState, useEffect, useCallback } from 'react';
import { Prospect, ProspectFormData, ReminderData } from '../types/crm-types';
import mockProspectsData from '../data/mockProspects';
import { useProspectActions } from './prospect/useProspectActions';
import { useProspectData } from './prospect/useProspectData';

export const useProspects = () => {
  // State for prospects data
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and selection
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  
  // Get data and actions
  const { fetchProspects, sourceOptions, statusOptions } = useProspectData();
  const { 
    addProspect: addProspectAction, 
    updateProspect: updateProspectAction,
    deleteProspect: deleteProspectAction,
    convertToClient: convertToClientAction,
    addReminder: addReminderAction
  } = useProspectActions(setProspects, setIsLoading);

  // Load initial data
  useEffect(() => {
    const loadProspects = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProspects();
        setProspects(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading prospects:', err);
        setError(err.message || 'Failed to load prospects');
        // Fallback to mock data
        setProspects(mockProspectsData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProspects();
  }, [fetchProspects]);
  
  // Handler for adding a new prospect
  const addProspect = useCallback(async (data: ProspectFormData) => {
    try {
      const newProspect = await addProspectAction(data);
      return newProspect;
    } catch (error) {
      console.error('Error in addProspect:', error);
      throw error;
    }
  }, [addProspectAction]);
  
  // Handler for updating a prospect
  const updateProspect = useCallback(async (id: string, data: Partial<ProspectFormData>) => {
    try {
      const updatedProspect = await updateProspectAction(id, data);
      return updatedProspect;
    } catch (error) {
      console.error('Error in updateProspect:', error);
      throw error;
    }
  }, [updateProspectAction]);
  
  // Handler for deleting a prospect
  const deleteProspect = useCallback(async (id: string) => {
    try {
      await deleteProspectAction(id);
    } catch (error) {
      console.error('Error in deleteProspect:', error);
      throw error;
    }
  }, [deleteProspectAction]);
  
  // Handler for converting a prospect to a client
  const convertToClient = useCallback(async (prospect: Prospect) => {
    try {
      await convertToClientAction(prospect);
      return true;
    } catch (error) {
      console.error('Error in convertToClient:', error);
      throw error;
    }
  }, [convertToClientAction]);
  
  // Handler for adding a reminder
  const addReminder = useCallback(async (prospectId: string, data: ReminderData) => {
    try {
      await addReminderAction(prospectId, data);
    } catch (error) {
      console.error('Error in addReminder:', error);
      throw error;
    }
  }, [addReminderAction]);
  
  // Filter prospects based on search term and status
  const filteredProspects = prospects.filter(prospect => {
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    const matchesSearch = !searchTerm || 
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prospect.contactEmail && prospect.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });
  
  return {
    prospects: filteredProspects,
    isLoading,
    error,
    sourceOptions,
    statusOptions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedProspect,
    setSelectedProspect,
    addProspect,
    updateProspect,
    deleteProspect,
    convertToClient,
    addReminder
  };
};
