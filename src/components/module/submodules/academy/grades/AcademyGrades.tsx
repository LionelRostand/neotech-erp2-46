
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyGrades = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Notes</CardTitle>
          <CardDescription>
            Saisie, calcul et gestion des notes des élèves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de gestion des notes en cours de développement. Ce module permettra de calculer les moyennes par matière,
            les moyennes annuelles et d'appliquer les différentes pondérations pour les évaluations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyGrades;
