
import React from 'react';
import { TrackingEvent } from '@/types/freight';
import { formatPackageStatus, getStatusColor } from './utils/statusUtils';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatusBadge from '@/components/StatusBadge';
import MapPreview from './MapPreview';
import { Check, Bell, BellOff, MapPin } from 'lucide-react';

interface TrackingTimelineProps {
  events: TrackingEvent[];
  showMaps?: boolean;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events, showMaps = true }) => {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun événement de suivi disponible pour ce colis.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event, index) => (
        <div key={event.id} className="relative pb-8">
          {/* Timeline connector */}
          {index < events.length - 1 && (
            <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
          )}
          
          <div className="relative flex items-start">
            {/* Timeline icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${
                event.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                event.status === 'exception' || event.status === 'lost' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {event.status === 'delivered' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </span>
            </div>
            
            {/* Timeline content */}
            <div className="ml-4 w-full">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {formatPackageStatus(event.status)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(event.timestamp), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={getStatusColor(event.status)}>
                    {formatPackageStatus(event.status)}
                  </StatusBadge>
                  {event.isNotified ? (
                    <Bell className="h-4 w-4 text-green-500" aria-label="Notification envoyée" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-400" aria-label="Pas de notification" />
                  )}
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-600">{event.description}</p>
              
              {/* Location map if available and maps are enabled */}
              {showMaps && event.location && (
                <div className="mt-2">
                  <MapPreview location={event.location} className="border" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;
