
import { useCollectionData } from '../useCollectionData';
import { doc, collection, getDoc, setDoc, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { orderBy, limit, where } from 'firebase/firestore';
import { useCallback } from 'react';

/**
 * Hook to fetch data for the CRM module
 */
export const useCrmData = () => {
  // Créer les références aux collections appropriées
  const clientsCollection = 'crm/clients';
  const prospectsCollection = 'crm/prospects';
  const opportunitiesCollection = 'crm/opportunities';
  const contactsCollection = 'crm/contacts';
  const leadsCollection = 'crm/leads';
  const dealsCollection = 'crm/deals';
  const settingsCollection = 'crm/settings';
  const remindersCollection = 'crm/reminders';

  // Fetch clients
  const clientsResult = useCollectionData(
    clientsCollection,
    [orderBy('createdAt', 'desc'), limit(100)]
  );
  
  // Fetch prospects
  const prospectsResult = useCollectionData(
    prospectsCollection,
    [orderBy('createdAt', 'desc'), limit(100)]
  );

  // Fetch opportunities
  const opportunitiesResult = useCollectionData(
    opportunitiesCollection,
    [orderBy('updatedAt', 'desc'), limit(100)]
  );

  // Fetch contacts
  const contactsResult = useCollectionData(
    contactsCollection,
    [orderBy('lastName', 'asc'), limit(100)]
  );

  // Fetch leads
  const leadsResult = useCollectionData(
    leadsCollection,
    [orderBy('createdAt', 'desc'), limit(100)]
  );

  // Fetch deals
  const dealsResult = useCollectionData(
    dealsCollection,
    [orderBy('updatedAt', 'desc'), limit(100)]
  );

  // Fetch settings
  const settingsResult = useCollectionData(
    settingsCollection,
    []
  );

  // Fetch reminders
  const remindersResult = useCollectionData(
    remindersCollection,
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
