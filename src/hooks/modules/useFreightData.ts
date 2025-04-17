
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Ensure the FREIGHT collections are properly typed
export const useFreightData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check for empty or invalid collection paths to prevent Firebase errors
  const validateCollectionPath = (path: string | undefined): string => {
    if (!path) {
      console.error('Invalid collection path detected');
      return 'invalid_collection';
    }
    return path;
  };

  // Shipments data
  const shipmentsPath = validateCollectionPath(COLLECTIONS.FREIGHT.SHIPMENTS);
  const { 
    data: shipments, 
    isLoading: shipmentsLoading, 
    error: shipmentsError 
  } = useCollectionData(shipmentsPath);

  // Carriers data
  const carriersPath = validateCollectionPath(COLLECTIONS.FREIGHT.CARRIERS);
  const { 
    data: carriers, 
    isLoading: carriersLoading, 
    error: carriersError 
  } = useCollectionData(carriersPath);

  // Customers data
  const customersPath = validateCollectionPath(COLLECTIONS.FREIGHT.CUSTOMERS);
  const { 
    data: customers, 
    isLoading: customersLoading, 
    error: customersError 
  } = useCollectionData(customersPath);

  // Packages data 
  const packagesPath = validateCollectionPath(COLLECTIONS.FREIGHT.PACKAGES);
  const { 
    data: packages, 
    isLoading: packagesLoading, 
    error: packagesError 
  } = useCollectionData(packagesPath);

  // Update the loading and error state based on all requests
  useEffect(() => {
    const isLoading = shipmentsLoading || carriersLoading || customersLoading || packagesLoading;
    setLoading(isLoading);

    // Collect and process errors
    const errors = [shipmentsError, carriersError, customersError, packagesError].filter(Boolean);
    
    if (errors.length > 0) {
      // Combine error messages
      const combinedError = new Error(
        `Multiple errors: ${errors.map(err => err?.message).join('; ')}`
      );
      setError(combinedError);
    } else {
      setError(null);
    }
  }, [
    shipmentsLoading, shipmentsError,
    carriersLoading, carriersError,
    customersLoading, customersError,
    packagesLoading, packagesError
  ]);

  return {
    shipments: shipments || [],
    carriers: carriers || [],
    customers: customers || [],
    packages: packages || [],
    loading,
    error
  };
};

export default useFreightData;
