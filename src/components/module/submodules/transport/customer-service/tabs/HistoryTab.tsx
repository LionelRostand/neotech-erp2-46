
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const HistoryTab: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Historique des Interactions</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Le module d'historique des interactions clients sera implémenté dans la prochaine mise à jour.
              Il permettra de visualiser l'ensemble des échanges avec un client, tous canaux confondus.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
