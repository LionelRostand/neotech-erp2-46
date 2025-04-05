
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { useCallback } from 'react';

/**
 * Hook to fetch data for the CRM module
 */
export const useCrmData = () => {
  // Fetch clients
  const { 
    data: clients, 
    isLoading: isClientsLoading, 
    error: clientsError,
    refreshData: refreshClientsData
  } = useCollectionData(
    COLLECTIONS.CRM.CLIENTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch prospects
  const { 
    data: prospects, 
    isLoading: isProspectsLoading, 
    error: prospectsError,
    refreshData: refreshProspectsData
  } = useCollectionData(
    COLLECTIONS.CRM.PROSPECTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch opportunities
  const { 
    data: opportunities, 
    isLoading: isOpportunitiesLoading, 
    error: opportunitiesError,
    refreshData: refreshOpportunitiesData
  } = useCollectionData(
    COLLECTIONS.CRM.OPPORTUNITIES,
    [orderBy('updatedAt', 'desc')]
  );

  // Fetch contacts
  const { 
    data: contacts, 
    isLoading: isContactsLoading, 
    error: contactsError,
    refreshData: refreshContactsData
  } = useCollectionData(
    COLLECTIONS.CRM.CONTACTS,
    [orderBy('lastName')]
  );

  // Fetch leads
  const {
    data: leads,
    isLoading: isLeadsLoading,
    error: leadsError,
    refreshData: refreshLeadsData
  } = useCollectionData(
    COLLECTIONS.CRM.LEADS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch deals
  const {
    data: deals,
    isLoading: isDealsLoading,
    error: dealsError,
    refreshData: refreshDealsData
  } = useCollectionData(
    COLLECTIONS.CRM.DEALS,
    [orderBy('updatedAt', 'desc')]
  );

  // Check if any data is still loading
  const isLoading = isClientsLoading || isProspectsLoading || isOpportunitiesLoading || 
                    isContactsLoading || isLeadsLoading || isDealsLoading;

  // Combine all possible errors
  const error = clientsError || prospectsError || opportunitiesError || 
                contactsError || leadsError || dealsError;

  // Function to refresh all data
  const refreshData = useCallback(() => {
    if (refreshClientsData) refreshClientsData();
    if (refreshProspectsData) refreshProspectsData();
    if (refreshOpportunitiesData) refreshOpportunitiesData();
    if (refreshContactsData) refreshContactsData();
    if (refreshLeadsData) refreshLeadsData();
    if (refreshDealsData) refreshDealsData();
  }, [
    refreshClientsData, 
    refreshProspectsData, 
    refreshOpportunitiesData, 
    refreshContactsData, 
    refreshLeadsData, 
    refreshDealsData
  ]);

  return {
    clients,
    prospects,
    opportunities,
    contacts,
    leads,
    deals,
    isLoading,
    error,
    refreshData
  };
};
