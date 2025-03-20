
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PharmacyPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pharmacie</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer les médicaments et stocks de la pharmacie.
            Fonctionnalités à venir : inventaire, commandes, prescriptions, alertes de stock, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyPage;
