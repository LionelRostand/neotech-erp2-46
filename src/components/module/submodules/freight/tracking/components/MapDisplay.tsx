
import React, { useRef } from 'react';
import { TrackingEvent } from '@/types/freight';
import { MapPin } from 'lucide-react';
import TrackingMap from './TrackingMap';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  events: TrackingEvent[];
  mapToken: string;
  error: string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ events, mapToken, error }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  if (error) {
    return (
      <div className="h-[400px] w-full bg-slate-50 rounded-md flex items-center justify-center">
        <div className="text-center space-y-2 p-4">
          <MapPin className="h-8 w-8 text-red-400 mx-auto" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full bg-slate-50 rounded-md relative">
      {!events.length ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-gray-500">Entrez un numéro de référence pour localiser votre colis</p>
          </div>
        </div>
      ) : (
        <TrackingMap events={events} />
      )}
    </div>
  );
};

export default MapDisplay;
