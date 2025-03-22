
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageClients = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Clients</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion des clients en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageClients;
