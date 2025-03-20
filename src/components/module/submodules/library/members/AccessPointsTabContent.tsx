
import React, { useState } from 'react';
import DevNotice from './access-points/DevNotice';
import AccessPointsList from './access-points/AccessPointsList';
import SearchBar from './access-points/SearchBar';
import { useAccessPoints } from './access-points/useAccessPoints';

const AccessPointsTabContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { accessPoints, isLoading } = useAccessPoints();
  
  const filteredAccessPoints = accessPoints.filter(point => 
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccessPoint = () => {
    console.log('Add access point clicked');
    // Fonctionnalité à implémenter ultérieurement
  };

  return (
    <div className="space-y-4">
      <DevNotice />
      
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onAddAccessPoint={handleAddAccessPoint} 
      />
      
      <AccessPointsList 
        accessPoints={filteredAccessPoints} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default AccessPointsTabContent;
