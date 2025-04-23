
import { useState, useEffect } from 'react';
import { useUnifiedTrackingData } from './modules/useUnifiedTrackingData';

export const useUnifiedTracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    data: foundItems = [], 
    isLoading,
    error 
  } = useUnifiedTrackingData(searchQuery);

  // Réinitialiser le statut de recherche lorsque isLoading change
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      // Petit délai pour s'assurer que la transition est fluide
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchDone(true);
    setLoading(true);
  };

  return {
    foundItems,
    isLoading,
    error,
    searchDone,
    handleSearch,
    loading,
    searchQuery
  };
};
