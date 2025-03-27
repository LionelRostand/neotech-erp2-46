
import React, { useRef } from 'react';
import { TrackingEvent } from '@/types/freight';
import { MapPin } from 'lucide-react';
import { useLeafletMap } from '../hooks/useLeafletMap';

interface MapDisplayProps {
  events: TrackingEvent[];
  mapToken: string;
  error: string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ events, mapToken, error }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook for map initialization
  useLeafletMap(mapRef, events, mapToken);

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full bg-slate-100 rounded-md relative"
      id="map"
    >
      {!events.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-gray-500">Entrez un numéro de référence pour localiser votre colis</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
