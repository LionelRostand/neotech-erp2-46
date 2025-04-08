
import { useCallback, useState } from 'react';
import { Prospect } from '../../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';
import { where, orderBy, limit, QueryConstraint } from 'firebase/firestore';

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

  // Fetch prospects from Firestore
  const fetchProspects = useCallback(async (): Promise<Prospect[]> => {
    try {
      const constraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc'),
        limit(100)
      ];
      
      // Use fetchCollectionData to get data from Firestore
      const prospects = await fetchCollectionData<Prospect>(
        COLLECTIONS.CRM.PROSPECTS, 
        constraints
      );
      
      console.log('Fetched prospects from Firestore:', prospects);
      return prospects;
    } catch (error) {
      console.error('Error fetching prospects:', error);
      toast.error('Erreur lors du chargement des prospects');
      throw error;
    }
  }, []);

  // Load prospects function (for compatibility with the old implementation)
  const loadProspects = useCallback(async () => {
    try {
      return await fetchProspects();
    } catch (error) {
      console.error('Error loading prospects:', error);
      throw error;
    }
  }, [fetchProspects]);

  // Function to fetch prospects by status
  const fetchProspectsByStatus = useCallback(async (status: string): Promise<Prospect[]> => {
    if (status === 'all') {
      return fetchProspects();
    }
    
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(100)
      ];
      
      const prospects = await fetchCollectionData<Prospect>(
        COLLECTIONS.CRM.PROSPECTS, 
        constraints
      );
      
      return prospects;
    } catch (error) {
      console.error(`Error fetching prospects with status ${status}:`, error);
      toast.error('Erreur lors du filtrage des prospects');
      throw error;
    }
  }, [fetchProspects]);

  return {
    fetchProspects,
    loadProspects,
    fetchProspectsByStatus,
    sourceOptions,
    statusOptions
  };
};
