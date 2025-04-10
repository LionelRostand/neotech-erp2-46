
import { useClientsQuery } from './useClientsQuery';
import { useClientMutations } from './useClientMutations';

export const useClientsData = () => {
  const { 
    clients, 
    isLoading: queryLoading, 
    error, 
    isOfflineMode, 
    fetchClients, 
    cancelLoading,
    seedMockClients
  } = useClientsQuery();

  const {
    isLoading: mutationLoading,
    addClient,
    updateClient,
    deleteClient
  } = useClientMutations(fetchClients);

  // Combine loading states from both hooks
  const isLoading = queryLoading || mutationLoading;

  return {
    clients,
    isLoading,
    error,
    isOfflineMode,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    seedMockClients,
    cancelLoading
  };
};
