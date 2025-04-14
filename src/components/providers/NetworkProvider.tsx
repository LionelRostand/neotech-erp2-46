
import React from 'react';
import { useOfflineOperations } from '@/hooks/firestore/network-operations';

interface NetworkProviderProps {
  children: React.ReactNode;
}

/**
 * NetworkProvider component to handle network state and connectivity
 * This ensures proper lifecycle of network event listeners
 */
export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  // Utiliser le hook pour configurer les listeners réseau
  useOfflineOperations();
  
  return <>{children}</>;
};

export default NetworkProvider;
