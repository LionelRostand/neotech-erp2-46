
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LaboratoryPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Laboratoire</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer les analyses médicales.
            Fonctionnalités à venir : demandes d'analyses, résultats, suivi des échantillons, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaboratoryPage;
