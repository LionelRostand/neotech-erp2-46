
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyExams = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Examens</CardTitle>
          <CardDescription>
            Organisation et suivi des évaluations et examens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de gestion des examens et évaluations en cours de développement. Ce module permettra de gérer les contrôles continus,
            les examens de fin de période et les examens finaux.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyExams;
