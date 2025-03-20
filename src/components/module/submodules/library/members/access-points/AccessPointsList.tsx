
import React from 'react';
import AccessPointCard from './AccessPointCard';
import EmptyState from './EmptyState';
import { AccessPoint } from './types';

interface AccessPointsListProps {
  accessPoints: AccessPoint[];
}

const AccessPointsList: React.FC<AccessPointsListProps> = ({ accessPoints }) => {
  if (accessPoints.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accessPoints.map((point) => (
        <AccessPointCard key={point.id} point={point} />
      ))}
    </div>
  );
};

export default AccessPointsList;
