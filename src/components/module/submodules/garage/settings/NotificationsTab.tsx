
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres des notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configurez les notifications du module garage.
        </p>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
