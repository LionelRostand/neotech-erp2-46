
import React from 'react';
import { AccessPoint } from './types';
import EmptyState from './EmptyState';
import AccessPointCard from './AccessPointCard';

interface AccessPointsListProps {
  accessPoints: AccessPoint[];
  isLoading: boolean;
}

const AccessPointsList: React.FC<AccessPointsListProps> = ({ accessPoints, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Chargement des points d'accès...</p>
        </div>
      </div>
    );
  }

  if (accessPoints.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accessPoints.map(accessPoint => (
        <AccessPointCard 
          key={accessPoint.id} 
          accessPoint={accessPoint} 
        />
      ))}
    </div>
  );
};

export default AccessPointsList;
