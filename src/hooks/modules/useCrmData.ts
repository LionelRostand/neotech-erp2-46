
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy, limit, where } from 'firebase/firestore';
import { useCallback } from 'react';

/**
 * Hook to fetch data for the CRM module
 */
export const useCrmData = () => {
  // Fetch clients
  const clientsResult = useCollectionData(
    COLLECTIONS.CRM.CLIENTS,
    [orderBy('createdAt', 'desc'), limit(100)]
  );
  
  // Fetch prospects
  const prospectsResult = useCollectionData(
    COLLECTIONS.CRM.PROSPECTS,
    [orderBy('createdAt', 'desc'), limit(100)]
  );

  // Fetch opportunities
  const opportunitiesResult = useCollectionData(
    COLLECTIONS.CRM.OPPORTUNITIES,
    [orderBy('updatedAt', 'desc'), limit(100)]
  );

  // Fetch contacts
  const contactsResult = useCollectionData(
    COLLECTIONS.CRM.CONTACTS,
    [orderBy('lastName', 'asc'), limit(100)]
  );

  // Fetch leads
  const leadsResult = useCollectionData(
    COLLECTIONS.CRM.LEADS,
    [orderBy('createdAt', 'desc'), limit(100)]
  );

  // Fetch deals
  const dealsResult = useCollectionData(
    COLLECTIONS.CRM.DEALS,
    [orderBy('updatedAt', 'desc'), limit(100)]
  );

  // Fetch settings
  const settingsResult = useCollectionData(
    COLLECTIONS.CRM.SETTINGS,
    []
  );

  // Fetch reminders
  const remindersResult = useCollectionData(
    COLLECTIONS.CRM.REMINDERS,
    [orderBy('dueDate', 'asc'), where('completed', '==', false), limit(20)]
  );

  // Check if any data is still loading
  const isLoading = clientsResult.isLoading || prospectsResult.isLoading || opportunitiesResult.isLoading || 
                    contactsResult.isLoading || leadsResult.isLoading || dealsResult.isLoading ||
                    settingsResult.isLoading || remindersResult.isLoading;

  // Combine all possible errors
  const error = clientsResult.error || prospectsResult.error || opportunitiesResult.error || 
                contactsResult.error || leadsResult.error || dealsResult.error ||
                settingsResult.error || remindersResult.error;

  // Function to refresh all data
  const refreshData = useCallback(() => {
    // Since useCollectionData uses onSnapshot, the data is automatically refreshed
    // This function is kept for API consistency
    console.log('Refreshing CRM data');
  }, []);

  return {
    clients: clientsResult.data || [],
    prospects: prospectsResult.data || [],
    opportunities: opportunitiesResult.data || [],
    contacts: contactsResult.data || [],
    leads: leadsResult.data || [],
    deals: dealsResult.data || [],
    settings: settingsResult.data || [],
    reminders: remindersResult.data || [],
    isLoading,
    error,
    refreshData
  };
};
