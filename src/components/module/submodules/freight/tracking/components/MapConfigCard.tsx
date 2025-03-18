
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MapConfigCardProps {
  mapToken: string;
  setMapToken: (token: string) => void;
}

const MapConfigCard: React.FC<MapConfigCardProps> = ({ mapToken, setMapToken }) => {
  const { toast } = useToast();

  const handleSaveToken = () => {
    localStorage.setItem('mapbox_token', mapToken);
    toast({
      title: "Succès",
      description: "Token sauvegardé avec succès."
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="font-medium">Configuration de la carte</h3>
        <p className="text-sm text-gray-600">
          Pour afficher les cartes, veuillez entrer votre token OpenStreetMap (ou créez un compte sur 
          <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline"> OpenStreetMap</a>).
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            value={mapToken}
            onChange={(e) => setMapToken(e.target.value)}
            placeholder="Entrez votre token OpenStreetMap"
          />
          <Button onClick={handleSaveToken}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MapConfigCard;
