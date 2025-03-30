
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const WebsiteDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord du site web</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Modules intégrés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Connectez d'autres modules pour enrichir votre site web.</p>
            <Button variant="outline" className="w-full">
              Gérer les modules
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteDashboard;
