
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyTeachers = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Enseignants</CardTitle>
          <CardDescription>
            Gestion spécifique du corps enseignant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de gestion des enseignants en cours de développement. Ce module permettra de gérer les attributions de cours,
            les emplois du temps, les évaluations et la formation continue.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyTeachers;
