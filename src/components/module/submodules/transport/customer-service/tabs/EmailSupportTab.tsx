
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

const EmailSupportTab: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Support Email</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Le module de gestion des emails sera implémenté dans la prochaine mise à jour.
              Il permettra de gérer les tickets de support et les réponses aux clients.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSupportTab;
