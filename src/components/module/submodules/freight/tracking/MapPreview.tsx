
import React, { useEffect, useRef, useState } from 'react';
import { GeoLocation } from '@/types/freight';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, Map as MapIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MapPreviewProps {
  location?: GeoLocation;
  className?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ location, className }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenInputVisible, setTokenInputVisible] = useState(false);

  useEffect(() => {
    // Vérifier si un token est déjà stocké
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    } else {
      // Sinon, afficher l'input pour entrer le token
      setTokenInputVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!location || !mapboxToken || !mapContainerRef.current) return;

    // Créer une URL statique pour l'image de la carte Mapbox
    const mapImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f00(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},12,0/300x200?access_token=${mapboxToken}`;
    
    const mapContainer = mapContainerRef.current;
    
    // Créer l'élément image et l'ajouter au conteneur
    const img = document.createElement('img');
    img.src = mapImageUrl;
    img.alt = 'Map location';
    img.className = 'w-full h-full object-cover rounded-md';
    
    // Nettoyer le conteneur avant d'ajouter la nouvelle image
    while (mapContainer.firstChild) {
      mapContainer.removeChild(mapContainer.firstChild);
    }
    
    mapContainer.appendChild(img);
    
    return () => {
      // Nettoyer l'image lors du démontage du composant
      while (mapContainer.firstChild) {
        mapContainer.removeChild(mapContainer.firstChild);
      }
    };
  }, [location, mapboxToken]);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setTokenInputVisible(false);
    }
  };

  if (tokenInputVisible) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapIcon className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Configuration de la carte</h3>
          </div>
          <p className="text-sm text-gray-600">
            Pour afficher les cartes, veuillez entrer votre token public Mapbox.
            Vous pouvez l'obtenir en vous inscrivant sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>.
          </p>
          <form onSubmit={handleSaveToken} className="space-y-2">
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Entrez votre token public Mapbox"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </form>
        </div>
      </Card>
    );
  }

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

  return (
    <div className={`relative rounded-md overflow-hidden ${className || ''}`}>
      <div 
        ref={mapContainerRef} 
        className="bg-slate-200 h-[200px] w-full"
      >
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">Chargement de la carte...</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-2 text-xs">
        <div className="font-semibold">{location.address}</div>
        <div>{location.postalCode} {location.city}, {location.country}</div>
        <div className="text-gray-500">
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
