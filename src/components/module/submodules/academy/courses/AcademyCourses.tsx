
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyCourses = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Cours</CardTitle>
          <CardDescription>
            Planification et organisation des cours et programmes scolaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de gestion des cours et des programmes académiques en cours de développement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyCourses;
