
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademySettings = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du Module Académique</CardTitle>
          <CardDescription>
            Configuration du module de gestion académique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de configuration en cours de développement. Ce module permettra de configurer les paramètres généraux
            de l'établissement, les périodes scolaires, et les règles d'évaluation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademySettings;
