
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres</h2>
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du module Garage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion des paramètres en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageSettings;
