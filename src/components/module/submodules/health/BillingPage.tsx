
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const BillingPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Facturation</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Cette section permettra de gérer la facturation des soins et services.
            Fonctionnalités à venir : génération de factures, suivi des paiements, remboursements, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
