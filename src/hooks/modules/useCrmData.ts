
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';

/**
 * Hook to fetch data for the CRM module
 */
export const useCrmData = () => {
  // Fetch clients
  const { 
    data: clients, 
    isLoading: isClientsLoading, 
    error: clientsError,
    refreshData: refreshClients
  } = useCollectionData(
    COLLECTIONS.CRM.CLIENTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch prospects
  const { 
    data: prospects, 
    isLoading: isProspectsLoading, 
    error: prospectsError,
    refreshData: refreshProspects
  } = useCollectionData(
    COLLECTIONS.CRM.PROSPECTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch opportunities
  const { 
    data: opportunities, 
    isLoading: isOpportunitiesLoading, 
    error: opportunitiesError,
    refreshData: refreshOpportunities
  } = useCollectionData(
    COLLECTIONS.CRM.OPPORTUNITIES,
    [orderBy('updatedAt', 'desc')]
  );

  // Fetch contacts
  const { 
    data: contacts, 
    isLoading: isContactsLoading, 
    error: contactsError,
    refreshData: refreshContacts
  } = useCollectionData(
    COLLECTIONS.CRM.CONTACTS,
    [orderBy('lastName')]
  );

  // Fetch leads
  const {
    data: leads,
    isLoading: isLeadsLoading,
    error: leadsError,
    refreshData: refreshLeads
  } = useCollectionData(
    COLLECTIONS.CRM.LEADS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch deals
  const {
    data: deals,
    isLoading: isDealsLoading,
    error: dealsError,
    refreshData: refreshDeals
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
  const refreshData = () => {
    refreshClients?.();
    refreshProspects?.();
    refreshOpportunities?.();
    refreshContacts?.();
    refreshLeads?.();
    refreshDeals?.();
  };

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
