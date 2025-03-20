
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const NursesPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestion du Personnel Soignant</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer le personnel soignant (infirmiers, aides-soignants, etc.).
            Fonctionnalités à venir : liste du personnel, gestion des plannings, gestion des compétences, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NursesPage;
