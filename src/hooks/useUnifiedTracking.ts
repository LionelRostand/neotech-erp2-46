
import { useState } from 'react';
import { useUnifiedTrackingData } from './modules/useUnifiedTrackingData';

export const useUnifiedTracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  
  const { 
    data: foundItems = [], 
    isLoading,
    error 
  } = useUnifiedTrackingData(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchDone(true);
  };

  return {
    foundItems,
    isLoading,
    error,
    searchDone,
    handleSearch,
    loading: isLoading,
    searchQuery
  };
};
