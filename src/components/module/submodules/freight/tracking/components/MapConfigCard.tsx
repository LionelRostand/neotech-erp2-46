
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MapConfigCardProps {
  mapToken: string;
  setMapToken: (token: string) => void;
}

const MapConfigCard: React.FC<MapConfigCardProps> = ({ mapToken, setMapToken }) => {
  const { toast } = useToast();

  const handleContinue = () => {
    // OpenStreetMap doesn't need a token, so we can just set a placeholder value
    const placeholderToken = "openstreetmap_default";
    setMapToken(placeholderToken);
    localStorage.setItem('mapbox_token', placeholderToken);
    toast({
      title: "Carte configurée",
      description: "La carte OpenStreetMap est maintenant configurée et prête à l'utilisation."
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="font-medium">Configuration de la carte</h3>
        <p className="text-sm text-gray-600">
          Cette application utilise OpenStreetMap pour afficher la localisation des colis.
          Aucun token n'est nécessaire pour continuer.
        </p>
        <div className="flex justify-end">
          <Button onClick={handleContinue}>
            Continuer
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MapConfigCard;
