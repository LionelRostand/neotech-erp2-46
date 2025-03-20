
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RoomsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestion des Chambres</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer les chambres et lits de l'établissement.
            Fonctionnalités à venir : occupation des chambres, planification des séjours, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomsPage;
