import { useCallback, useState } from 'react';
import { Prospect } from '../../types/crm-types';
import { mockProspects } from '../../data/mockProspects';
import { toast } from 'sonner';

export const useProspectData = () => {
  // Status options for prospects
  const statusOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'Nouveau', value: 'new' },
    { label: 'Contacté', value: 'contacted' },
    { label: 'Rendez-vous', value: 'meeting' },
    { label: 'Proposition', value: 'proposal' },
    { label: 'Négociation', value: 'negotiation' },
    { label: 'Converti', value: 'converted' },
    { label: 'Perdu', value: 'lost' }
  ];
  
  // Source options for prospects
  const sourceOptions = [
    { label: 'Site web', value: 'website' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Parrainage', value: 'referral' },
    { label: 'Salon professionnel', value: 'tradeshow' },
    { label: 'Email marketing', value: 'email' },
    { label: 'Appel entrant', value: 'call' },
    { label: 'Autre', value: 'other' }
  ];

  // Fetch prospects from API or use mock data
  const fetchProspects = useCallback(async (): Promise<Prospect[]> => {
    try {
      // In a real app, this would be a fetch call to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return mockProspects;
    } catch (error) {
      console.error('Error fetching prospects:', error);
      toast.error('Erreur lors du chargement des prospects');
      throw error;
    }
  }, []);

  // Load prospects function (for compatibility with the old implementation)
  const loadProspects = useCallback(async () => {
    try {
      // This function is kept for compatibility with the old implementation
      // that expected a setProspects and setLoading parameters
      return await fetchProspects();
    } catch (error) {
      console.error('Error loading prospects:', error);
      throw error;
    }
  }, [fetchProspects]);

  return {
    fetchProspects,
    loadProspects,
    sourceOptions,
    statusOptions
  };
};
