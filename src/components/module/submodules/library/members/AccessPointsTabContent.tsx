
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import SearchBar from './access-points/SearchBar';
import AccessPointsList from './access-points/AccessPointsList';
import DevNotice from './access-points/DevNotice';
import { useAccessPoints } from './access-points/useAccessPoints';

const AccessPointsTabContent: React.FC = () => {
  const { filteredAccessPoints, searchQuery, setSearchQuery } = useAccessPoints();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        <Button className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un point d'accès
        </Button>
      </div>

      <AccessPointsList accessPoints={filteredAccessPoints} />
      <DevNotice />
    </div>
  );
};

export default AccessPointsTabContent;
