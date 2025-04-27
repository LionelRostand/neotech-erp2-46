
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyReports = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulletins Scolaires</CardTitle>
          <CardDescription>
            Génération et gestion des bulletins scolaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de génération des bulletins scolaires en cours de développement. Ce module permettra de créer des bulletins
            trimestriels ou semestriels avec les notes, appréciations et classements des élèves.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyReports;
