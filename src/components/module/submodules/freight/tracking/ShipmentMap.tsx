
import React, { useEffect, useRef, useState } from 'react';
import { Package, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { mockLocations } from './utils/locationUtils';

interface ShipmentMapProps {
  events: any[];
  trackingCode: string;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ events, trackingCode }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [mapError, setMapError] = useState<boolean>(false);

  // Filtrer les événements qui ont des coordonnées de localisation
  const locatedEvents = events.filter(event => event.location && event.location.latitude && event.location.longitude);
  
  // Si aucun événement n'a de coordonnées, utiliser des coordonnées par défaut
  if (locatedEvents.length === 0 && events.length > 0) {
    // Ajouter des coordonnées fictives aux événements existants
    events.forEach((event, index) => {
      if (index < mockLocations.length) {
        event.location = mockLocations[index];
      }
    });
  }

  // Initialiser et dessiner la carte
  useEffect(() => {
    if (!mapRef.current || events.length === 0) return;
    
    try {
      // Simule le rendu d'une carte avec des marqueurs
      // Dans une implémentation réelle, utilisez Leaflet, Google Maps ou Mapbox
      renderSimulatedMap();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte", error);
      setMapError(true);
    }
    
    // Fonction de simulation pour le rendu de la carte
    function renderSimulatedMap() {
      if (!mapRef.current) return;
      
      const mapContainer = mapRef.current;
      
      // Style de base de la carte
      mapContainer.style.backgroundImage = mapType === 'satellite' 
        ? 'url("https://miro.medium.com/max/1400/1*qZ1lrF9K7RuIgOQPNvNFLQ.png")' 
        : 'url("https://i.stack.imgur.com/T9oHl.png")';
      mapContainer.style.backgroundSize = 'cover';
      mapContainer.style.backgroundPosition = 'center';
      mapContainer.innerHTML = '';
      
      // Ajouter des marqueurs pour chaque événement avec localisation
      events.forEach((event, index) => {
        if (!event.location) return;
        
        // Créer un élément div pour représenter le marqueur
        const marker = document.createElement('div');
        marker.className = 'absolute z-10 flex flex-col items-center';
        marker.style.transform = 'translate(-50%, -100%)';
        
        // Positionner le marqueur sur la "carte"
        // Nous utilisons des valeurs relatives basées sur l'index pour la simulation
        const left = 20 + (index * 15) + (Math.random() * 10);
        const top = 30 + (index * 10) + (Math.random() * 10);
        marker.style.left = `${Math.min(left, 80)}%`;
        marker.style.top = `${Math.min(top, 70)}%`;
        
        // Créer l'icône du marqueur
        const markerIcon = document.createElement('div');
        markerIcon.className = `rounded-full p-1 ${index === 0 ? 'bg-primary text-white' : 'bg-white text-primary'} shadow-lg`;
        
        // Déterminer l'icône à afficher selon le type d'événement
        let icon = '';
        if (event.type === 'delivery') {
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        } else if (event.type === 'pickup') {
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
        } else {
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        }
        
        markerIcon.innerHTML = icon;
        marker.appendChild(markerIcon);
        
        // Créer l'étiquette pour le marqueur
        const label = document.createElement('div');
        label.className = 'bg-white px-2 py-1 rounded shadow-md text-xs mt-1';
        label.textContent = new Date(event.timestamp).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        });
        marker.appendChild(label);
        
        // Ajouter un effet de survol
        marker.addEventListener('mouseenter', () => {
          label.className = 'bg-primary text-white px-2 py-1 rounded shadow-md text-xs mt-1';
          label.textContent = event.description;
        });
        
        marker.addEventListener('mouseleave', () => {
          label.className = 'bg-white px-2 py-1 rounded shadow-md text-xs mt-1';
          label.textContent = new Date(event.timestamp).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short' 
          });
        });
        
        mapContainer.appendChild(marker);
      });
      
      // Tracer des lignes entre les marqueurs dans une implémentation réelle
      // Pour cette simulation, nous dessinons une simple ligne en SVG
      if (events.length > 1) {
        const path = document.createElement('div');
        path.className = 'absolute top-0 left-0 w-full h-full z-0';
        path.innerHTML = `
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline 
              points="${events.map((_, i) => {
                const x = 20 + (i * 15) + (Math.random() * 10);
                const y = 30 + (i * 10) + (Math.random() * 10);
                return `${Math.min(x, 80)},${Math.min(y, 70)}`;
              }).join(' ')}"
              fill="none" 
              stroke="#3b82f6" 
              stroke-width="2"
              stroke-dasharray="5,5"
            />
          </svg>
        `;
        mapContainer.appendChild(path);
      }
      
      // Ajouter des informations sur le colis
      const infoCard = document.createElement('div');
      infoCard.className = 'absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-xs';
      infoCard.innerHTML = `
        <div class="font-bold">Colis: ${trackingCode}</div>
        <div>Mise à jour: ${new Date(events[0].timestamp).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit', 
          minute: '2-digit'
        })}</div>
      `;
      mapContainer.appendChild(infoCard);
    }
  }, [events, mapType, trackingCode]);
  
  // Gérer le changement de type de carte
  const handleMapTypeChange = (value: string) => {
    setMapType(value);
  };

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Impossible d'afficher la carte</h3>
        <p className="text-muted-foreground text-center mb-4">
          Une erreur s'est produite lors du chargement de la carte. Veuillez réessayer plus tard.
        </p>
        <Button onClick={() => setMapError(false)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-2 right-2 z-10">
        <Tabs value={mapType} onValueChange={handleMapTypeChange}>
          <TabsList className="bg-white bg-opacity-90">
            <TabsTrigger value="roadmap">Carte</TabsTrigger>
            <TabsTrigger value="satellite">Satellite</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="absolute top-2 left-2 z-10">
        <Card className="bg-white bg-opacity-90 p-2 text-xs">
          <div className="flex items-center gap-1 mb-1">
            <Package className="h-3 w-3" />
            <span className="font-medium">Suivi du colis: {trackingCode}</span>
          </div>
          <div className="text-muted-foreground">
            {events.length} points de suivi
          </div>
        </Card>
      </div>
      
      <div 
        ref={mapRef} 
        className="relative w-full h-full bg-gray-100 overflow-hidden"
      >
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chargement de la carte...</p>
          </div>
        )}
      </div>
      
      {events.length > 0 && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className="flex flex-col gap-1">
            <Button size="sm" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">Confirmer réception</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentMap;
