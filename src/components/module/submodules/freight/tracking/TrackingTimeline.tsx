
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrackingEvent } from '@/types/freight';
import { formatPackageStatus } from './utils/statusUtils';
import { Package, MapPin, ArrowDown } from 'lucide-react';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
  // Trier les événements du plus récent au plus ancien
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Si aucun événement, afficher un message
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucun événement de suivi</h3>
          <p className="text-muted-foreground">
            Aucun événement de suivi n'a encore été enregistré pour ce colis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                <Package className="h-4 w-4 text-white" />
              </div>
              {index < sortedEvents.length - 1 && (
                <div className="h-16 w-px bg-border mx-auto my-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground absolute left-5 top-12 -translate-x-1/2" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="font-medium">{formatPackageStatus(event.status)}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm">{event.description}</p>
                  
                  {event.location && (
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {[
                          event.location.address,
                          event.location.city,
                          event.location.postalCode,
                          event.location.country
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    delivered: "bg-green-500",
    in_transit: "bg-blue-500",
    processing: "bg-violet-500",
    registered: "bg-slate-500",
    out_for_delivery: "bg-teal-500",
    delayed: "bg-amber-500",
    exception: "bg-red-500",
    returned: "bg-red-500",
    lost: "bg-gray-500"
  };

  return statusColors[status] || "bg-slate-500";
}

export default TrackingTimeline;
