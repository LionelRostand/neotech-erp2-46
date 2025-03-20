
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PrescriptionsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Ordonnances</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer les ordonnances médicales.
            Fonctionnalités à venir : création d'ordonnances, suivi des prescriptions, envoi aux pharmacies, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionsPage;
