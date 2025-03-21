
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones } from "lucide-react";

const TransportCustomerService = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Service Client Transport</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            <span>Support Clients</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <Headphones className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Support Clients</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Le module de service client sera implémenté dans la prochaine mise à jour.
                Vous pourrez y gérer les réclamations, offrir un support via plusieurs canaux et suivre les interactions clients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportCustomerService;
