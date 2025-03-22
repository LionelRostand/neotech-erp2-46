
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageInventory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Inventaire</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestion de l'inventaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion de l'inventaire en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageInventory;
