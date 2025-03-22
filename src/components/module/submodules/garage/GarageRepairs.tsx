
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageRepairs = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Réparations</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des réparations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion des réparations en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageRepairs;
