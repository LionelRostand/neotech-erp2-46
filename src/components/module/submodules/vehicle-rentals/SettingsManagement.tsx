
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>En cours d'implémentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette section permettra bientôt de :</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Configurer les tarifs et promotions</li>
            <li>Gérer les rôles et permissions utilisateurs</li>
            <li>Personnaliser les documents (contrats, factures)</li>
            <li>Configurer les notifications automatiques</li>
            <li>Gérer les intégrations avec d'autres systèmes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
