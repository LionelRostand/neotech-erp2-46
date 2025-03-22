
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageVehicles = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Véhicules</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion des véhicules en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageVehicles;
