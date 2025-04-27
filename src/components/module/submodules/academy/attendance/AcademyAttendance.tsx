
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AcademyAttendance = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Présences et Absences</CardTitle>
          <CardDescription>
            Suivi des présences des élèves et du personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Module de gestion des présences en cours de développement. Ce module permettra de suivre les présences et absences
            des élèves et du personnel, avec notification aux parents en cas d'absence non justifiée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyAttendance;
