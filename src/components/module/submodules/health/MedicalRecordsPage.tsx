
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MedicalRecordsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dossiers Médicaux</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer les dossiers médicaux des patients.
            Fonctionnalités à venir : consultation des dossiers, ajout de documents, historique médical, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsPage;
