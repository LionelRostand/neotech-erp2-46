
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageAppointments = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Rendez-vous</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion des rendez-vous en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageAppointments;
