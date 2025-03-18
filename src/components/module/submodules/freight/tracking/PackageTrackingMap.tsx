
import React from 'react';
import { TrackingEvent } from '@/types/freight';
import { useTrackingMap } from './hooks/useTrackingMap';
import MapConfigCard from './components/MapConfigCard';
import TrackingSearchForm from './components/TrackingSearchForm';
import MapDisplay from './components/MapDisplay';
import MapStatusDisplay from './components/MapStatusDisplay';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './PackageTrackingStyles.css';

interface PackageTrackingMapProps {
  onTrackingFound?: (events: TrackingEvent[]) => void;
  initialEvents?: TrackingEvent[];
}

const PackageTrackingMap: React.FC<PackageTrackingMapProps> = ({ 
  onTrackingFound,
  initialEvents
}) => {
  const {
    currentEvents,
    setCurrentEvents,
    isLoading,
    error,
    mapToken,
    setMapToken,
    handleTrack
  } = useTrackingMap();

  // Initialize with any provided events
  React.useEffect(() => {
    if (initialEvents?.length) {
      setCurrentEvents(initialEvents);
    }
  }, [initialEvents, setCurrentEvents]);

  // Call the onTrackingFound callback when events change
  React.useEffect(() => {
    if (onTrackingFound && currentEvents.length > 0) {
      onTrackingFound(currentEvents);
    }
  }, [currentEvents, onTrackingFound]);

  // If no map token is configured, show the configuration screen
  if (!mapToken) {
    return <MapConfigCard mapToken={mapToken} setMapToken={setMapToken} />;
  }

  return (
    <div className="space-y-4">
      <TrackingSearchForm 
        onSearch={handleTrack} 
        isLoading={isLoading} 
      />
      
      <MapStatusDisplay events={currentEvents} error={error} />
      
      <MapDisplay 
        events={currentEvents} 
        mapToken={mapToken} 
        error={error}
      />
    </div>
  );
};

export default PackageTrackingMap;
