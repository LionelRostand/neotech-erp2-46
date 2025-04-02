
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
    error: clientsError 
  } = useCollectionData(
    COLLECTIONS.CRM.CLIENTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch prospects
  const { 
    data: prospects, 
    isLoading: isProspectsLoading, 
    error: prospectsError 
  } = useCollectionData(
    COLLECTIONS.CRM.PROSPECTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch opportunities
  const { 
    data: opportunities, 
    isLoading: isOpportunitiesLoading, 
    error: opportunitiesError 
  } = useCollectionData(
    COLLECTIONS.CRM.OPPORTUNITIES,
    [orderBy('updatedAt', 'desc')]
  );

  // Fetch contacts
  const { 
    data: contacts, 
    isLoading: isContactsLoading, 
    error: contactsError 
  } = useCollectionData(
    COLLECTIONS.CRM.CONTACTS,
    [orderBy('lastName')]
  );

  // Check if any data is still loading
  const isLoading = isClientsLoading || isProspectsLoading || isOpportunitiesLoading || isContactsLoading;

  // Combine all possible errors
  const error = clientsError || prospectsError || opportunitiesError || contactsError;

  return {
    clients,
    prospects,
    opportunities,
    contacts,
    isLoading,
    error
  };
};
