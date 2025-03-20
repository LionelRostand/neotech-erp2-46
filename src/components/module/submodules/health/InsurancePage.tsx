
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const InsurancePage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Assurances</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer les assurances et mutuelles des patients.
            Fonctionnalités à venir : vérification des couvertures, traitement des remboursements, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsurancePage;
