
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const TransportSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Paramètres du Transport</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Configuration</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Les paramètres du transport seront implémentés dans la prochaine mise à jour.
                Vous pourrez y configurer les tarifs, les conditions de location, gérer les permissions utilisateurs et les intégrations avec d'autres systèmes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportSettings;
