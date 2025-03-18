
import React from 'react';
import { GeoLocation, TrackingEvent } from '@/types/freight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import TrackingTimeline from '../TrackingTimeline';
import MapPreview from '../MapPreview';
import NotificationSettings from '../NotificationSettings';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '../PackageTrackingStyles.css';

interface TrackingTabsProps {
  packageId: string;
  events: TrackingEvent[];
  latestLocation?: GeoLocation;
  isLoading: boolean;
}

const TrackingTabs: React.FC<TrackingTabsProps> = ({ 
  packageId, 
  events, 
  latestLocation, 
  isLoading 
}) => {
  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList>
        <TabsTrigger value="timeline">Chronologie</TabsTrigger>
        <TabsTrigger value="map">Carte</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="timeline" className="space-y-4">
        {isLoading ? (
          <p>Chargement de la chronologie...</p>
        ) : (
          <TrackingTimeline events={events} />
        )}
      </TabsContent>
      
      <TabsContent value="map">
        {latestLocation ? (
          <MapPreview location={latestLocation} className="h-[300px]" />
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-800">Aucune information de localisation disponible pour ce colis.</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationSettings packageId={packageId} />
      </TabsContent>
    </Tabs>
  );
};

export default TrackingTabs;
