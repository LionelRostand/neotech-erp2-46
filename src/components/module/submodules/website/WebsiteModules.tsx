
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, Plus, ExternalLink } from 'lucide-react';

const WebsiteModules = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Modules du site web</h2>
      <p className="mt-2 text-muted-foreground">Intégrez d'autres modules à votre site web pour enrichir ses fonctionnalités.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Module de Transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Intégrez le système de réservation de transport sur votre site web.</p>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Configurer
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Module de Restauration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Intégrez les réservations de table pour votre restaurant.</p>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Configurer
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Module de Salon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Intégrez les réservations pour votre salon de beauté.</p>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Configurer
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau module</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Vous pouvez ajouter d'autres modules pour étendre les fonctionnalités de votre site web.</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un module
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteModules;
