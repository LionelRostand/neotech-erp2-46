
import React from 'react';
import AccessPointCard from './AccessPointCard';
import EmptyState from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { AccessPoint } from './types';

interface AccessPointsListProps {
  accessPoints: AccessPoint[];
  isLoading: boolean;
  onEdit?: (accessPoint: AccessPoint) => void;
  onDelete?: (id: string) => void;
}

const AccessPointsList: React.FC<AccessPointsListProps> = ({ 
  accessPoints, 
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (accessPoints.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accessPoints.map(point => (
        <AccessPointCard 
          key={point.id} 
          accessPoint={point} 
          onEdit={onEdit ? () => onEdit(point) : undefined}
          onDelete={onDelete ? () => onDelete(point.id) : undefined}
        />
      ))}
    </div>
  );
};

export default AccessPointsList;
