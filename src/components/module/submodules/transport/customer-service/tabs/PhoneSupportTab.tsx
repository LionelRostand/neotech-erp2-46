
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

const PhoneSupportTab: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Phone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Support Téléphonique</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Le module de gestion des appels sera implémenté dans la prochaine mise à jour.
              Il permettra d'enregistrer et de suivre les conversations téléphoniques avec les clients.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneSupportTab;
