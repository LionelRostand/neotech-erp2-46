
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { useCallback } from 'react';

/**
 * Hook to fetch data for the CRM module
 */
export const useCrmData = () => {
  // Fetch clients
  const clientsResult = useCollectionData(
    COLLECTIONS.CRM.CLIENTS,
    [orderBy('createdAt', 'desc')]
  );
  
  // Fetch prospects
  const prospectsResult = useCollectionData(
    COLLECTIONS.CRM.PROSPECTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch opportunities
  const opportunitiesResult = useCollectionData(
    COLLECTIONS.CRM.OPPORTUNITIES,
    [orderBy('updatedAt', 'desc')]
  );

  // Fetch contacts
  const contactsResult = useCollectionData(
    COLLECTIONS.CRM.CONTACTS,
    [orderBy('lastName')]
  );

  // Fetch leads
  const leadsResult = useCollectionData(
    COLLECTIONS.CRM.LEADS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch deals
  const dealsResult = useCollectionData(
    COLLECTIONS.CRM.DEALS,
    [orderBy('updatedAt', 'desc')]
  );

  // Check if any data is still loading
  const isLoading = clientsResult.isLoading || prospectsResult.isLoading || opportunitiesResult.isLoading || 
                    contactsResult.isLoading || leadsResult.isLoading || dealsResult.isLoading;

  // Combine all possible errors
  const error = clientsResult.error || prospectsResult.error || opportunitiesResult.error || 
                contactsResult.error || leadsResult.error || dealsResult.error;

  // Function to refresh all data
  const refreshData = useCallback(() => {
    // Since useCollectionData doesn't expose a refreshData method,
    // we would need to implement a refresh mechanism at the higher level
    console.log('Refreshing CRM data - note: actual refresh not implemented in useCollectionData');
  }, []);

  return {
    clients: clientsResult.data || [],
    prospects: prospectsResult.data || [],
    opportunities: opportunitiesResult.data || [],
    contacts: contactsResult.data || [],
    leads: leadsResult.data || [],
    deals: dealsResult.data || [],
    isLoading,
    error,
    refreshData
  };
};
