
import React, { useEffect } from 'react';
import { initializeNetworkListeners, cleanupNetworkListeners } from '@/hooks/firestore/network-operations';

interface NetworkProviderProps {
  children: React.ReactNode;
}

/**
 * NetworkProvider component to handle network state and connectivity
 * This ensures proper lifecycle of network event listeners
 */
export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize network listeners when component mounts
    initializeNetworkListeners();
    
    // Clean up listeners when component unmounts
    return () => {
      cleanupNetworkListeners();
    };
  }, []);
  
  return <>{children}</>;
};

export default NetworkProvider;
