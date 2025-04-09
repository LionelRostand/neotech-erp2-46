
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouveau Paiement
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="py-8 text-center">
            <p className="text-lg font-medium">Page des paiements en cours de développement</p>
            <p className="text-muted-foreground">
              Cette fonctionnalité sera bientôt disponible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
