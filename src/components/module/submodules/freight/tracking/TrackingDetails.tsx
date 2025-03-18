
import React, { useEffect, useState } from 'react';
import { Package, TrackingEvent } from '@/types/freight';
import { getPackageTrackingEvents, getLatestLocationFromEvents, getLatestEvent } from './mockTrackingData';
import PackageHeader from './components/PackageHeader';
import PackageInfoCard from './components/PackageInfoCard';
import TrackingTabs from './components/TrackingTabs';

interface TrackingDetailsProps {
  packageData: Package;
  onBack: () => void;
}

const TrackingDetails: React.FC<TrackingDetailsProps> = ({ packageData, onBack }) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingEvents = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          const events = getPackageTrackingEvents(packageData.id);
          setTrackingEvents(events);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements de tracking:", error);
        setIsLoading(false);
      }
    };

    fetchTrackingEvents();
  }, [packageData.id]);

  const latestLocation = getLatestLocationFromEvents(trackingEvents);
  
  return (
    <div className="space-y-6">
      <PackageHeader packageData={packageData} onBack={onBack} />
      <PackageInfoCard packageData={packageData} />
      <TrackingTabs 
        packageId={packageData.id}
        events={trackingEvents}
        latestLocation={latestLocation}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TrackingDetails;
