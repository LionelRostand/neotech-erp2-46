
import React from 'react';
import { TrackingEvent } from '@/types/freight';
import { formatPackageStatus } from '../mockTrackingData';
import { AlertTriangle } from 'lucide-react';

interface MapStatusDisplayProps {
  events: TrackingEvent[];
  error: string | null;
}

const MapStatusDisplay: React.FC<MapStatusDisplayProps> = ({ events, error }) => {
  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
        <p className="text-amber-800">{error}</p>
      </div>
    );
  }

  if (events.length > 0) {
    return (
      <div className="text-sm">
        <p className="font-medium">Dernier statut: {formatPackageStatus(events[0].status)}</p>
        {events[0].location && (
          <p>
            Localisation: {events[0].location.city}, {events[0].location.country}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default MapStatusDisplay;
