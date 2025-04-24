
import React, { useEffect, createContext, useContext, useState } from 'react';
import { initNetworkListeners, isOnline as checkIsOnline } from '@/hooks/firestore/network-handler';
import { toast } from 'sonner';

interface NetworkContextType {
  isOnline: boolean;
  isReconnecting: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isReconnecting: false
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: React.ReactNode;
}

/**
 * NetworkProvider component to handle network state and connectivity
 * This ensures proper lifecycle of network event listeners
 */
export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>({
    isOnline: checkIsOnline(),
    isReconnecting: false
  });
  
  useEffect(() => {
    const { cleanup } = initNetworkListeners(
      // Online handler
      () => {
        setNetworkState({ isOnline: true, isReconnecting: true });
        toast.success('Connexion rétablie');
        
        // After some time, set reconnecting to false
        setTimeout(() => {
          setNetworkState(prev => ({ ...prev, isReconnecting: false }));
        }, 3000);
      },
      // Offline handler
      () => {
        setNetworkState({ isOnline: false, isReconnecting: false });
        toast.warning('Connexion perdue. Mode hors ligne activé.');
      }
    );
    
    // Check initial network status
    setNetworkState(prev => ({ ...prev, isOnline: checkIsOnline() }));
    
    return cleanup;
  }, []);
  
  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
