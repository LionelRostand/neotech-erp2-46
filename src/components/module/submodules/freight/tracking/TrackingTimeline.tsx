
import React from 'react';
import { TrackingEvent } from '@/types/freight';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, Clock, MapPin, AlertTriangle, TruckIcon } from 'lucide-react';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
  const getEventIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_transit':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'delayed':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'exception':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'registered': 'Enregistré',
      'processing': 'En traitement',
      'in_transit': 'En transit',
      'out_for_delivery': 'En cours de livraison',
      'delivered': 'Livré',
      'delayed': 'Retardé',
      'exception': 'Problème',
      'returned': 'Retourné',
      'lost': 'Perdu'
    };
    
    return statusMap[status] || status;
  };

  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const formatAddress = (location: any): string => {
    if (!location) return 'Localisation non disponible';
    
    const parts = [
      location.address,
      location.city,
      location.postalCode,
      location.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:h-full before:bg-muted-foreground/20 ml-2">
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4">
          <div className="absolute left-0 top-1 z-10">
            {getEventIcon(event.status)}
          </div>
          <div className="pl-10 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="font-medium text-sm">
                {getStatusLabel(event.status)}
              </h4>
              <time className="text-xs text-muted-foreground">
                {formatTime(event.timestamp)}
              </time>
            </div>
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
            {event.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {formatAddress(event.location)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;
