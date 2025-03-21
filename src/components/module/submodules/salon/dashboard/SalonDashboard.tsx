
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const SalonDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">Tableau de bord du salon</h2>
            <p className="text-muted-foreground">
              Les statistiques et informations du salon seront affichées ici.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalonDashboard;
