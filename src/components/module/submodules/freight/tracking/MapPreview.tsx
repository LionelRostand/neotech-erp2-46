
import React from 'react';
import { GeoLocation } from '@/types/freight';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface MapPreviewProps {
  location?: GeoLocation;
  className?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ location, className }) => {
  if (!location) {
    return (
      <Alert variant="default" className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle>Localisation non disponible</AlertTitle>
        <AlertDescription>
          Aucune donnée GPS disponible pour cet événement.
        </AlertDescription>
      </Alert>
    );
  }
  
  // In a real application, we would use a mapping library like Mapbox, Leaflet, or Google Maps
  // For this demo, we'll display the location coordinates and address
  const mapImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f00(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},12,0/300x200?access_token=pk.placeholder`;
  
  return (
    <div className={`rounded-md overflow-hidden ${className}`}>
      <div className="bg-slate-200 h-[200px] w-full flex flex-col items-center justify-center">
        {/* This would be replaced with an actual map in a real application */}
        <div className="text-center p-4">
          <div className="mb-2 font-bold">Position GPS</div>
          <div className="text-sm text-gray-600 mb-2">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </div>
          {location.address && (
            <div className="text-sm">
              {location.address}<br />
              {location.postalCode} {location.city}<br />
              {location.country}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
