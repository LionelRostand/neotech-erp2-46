
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageInvoices = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Factures</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des factures</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité de gestion des factures en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageInvoices;
