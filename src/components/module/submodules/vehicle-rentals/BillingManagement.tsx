
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

const BillingManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Gestion de la Facturation</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span>En cours d'implémentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette section permettra bientôt de :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Générer automatiquement des factures et des devis</li>
            <li>Suivre les paiements et créer des relances automatiques</li>
            <li>Intégrer des solutions de paiement en ligne</li>
            <li>Gérer les cautions et remboursements</li>
            <li>Exporter les documents comptables</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
