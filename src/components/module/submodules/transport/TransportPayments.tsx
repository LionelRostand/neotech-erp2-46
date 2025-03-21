
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const TransportPayments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Paiements</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Transactions et Factures</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Transactions et Factures</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                La gestion des paiements sera implémentée dans la prochaine mise à jour.
                Vous pourrez y gérer les méthodes de paiement, la facturation et le suivi des transactions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportPayments;
