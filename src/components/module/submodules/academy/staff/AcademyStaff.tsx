
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyStaff = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion du Personnel</CardTitle>
          <CardDescription>
            Gestion du personnel enseignant et administratif de l'établissement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de gestion du personnel académique en cours de développement. Ce module permettra de gérer les recrutements,
            les diplômes, les contrats, les évaluations et la documentation du personnel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyStaff;
