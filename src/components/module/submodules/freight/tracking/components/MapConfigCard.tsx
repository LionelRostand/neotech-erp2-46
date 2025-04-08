
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapConfigCardProps {
  mapToken: string;
  setMapToken: (token: string) => void;
}

const MapConfigCard: React.FC<MapConfigCardProps> = ({ mapToken, setMapToken }) => {
  const [token, setToken] = useState(mapToken);
  const { toast } = useToast();

  const handleSaveToken = () => {
    if (!token.trim()) {
      toast({
        title: "Token requis",
        description: "Veuillez entrer un token de carte valide",
        variant: "destructive"
      });
      return;
    }

    // Sauvegarder le token
    setMapToken(token);
    localStorage.setItem('mapbox_token', token);
    
    toast({
      title: "Configuration enregistrée",
      description: "Votre token de carte a été sauvegardé",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configuration de la carte
        </CardTitle>
        <CardDescription>
          Pour activer les fonctionnalités de carte, vous devez fournir un token Mapbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Vous pouvez obtenir un token gratuit en vous inscrivant sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mapbox</a>. 
            Alternativement, vous pouvez utiliser un token de test pour les démonstrations.
          </p>
          
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Entrez votre token Mapbox"
            className="font-mono text-sm"
          />
          
          <p className="text-xs text-muted-foreground mt-1">
            Note : Pour une démonstration rapide, vous pouvez utiliser "pk.demo" comme token.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveToken}>Enregistrer la configuration</Button>
      </CardFooter>
    </Card>
  );
};

export default MapConfigCard;
