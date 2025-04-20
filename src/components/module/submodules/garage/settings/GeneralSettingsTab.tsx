
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeneralSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configuration générale du module garage.
        </p>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;
