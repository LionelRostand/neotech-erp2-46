
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ManagePermissionsDialog from './ManagePermissionsDialog';

const PermissionsSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Permissions des utilisateurs</CardTitle>
        <ManagePermissionsDialog roleId="default" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Gérez les permissions d'accès aux différentes fonctionnalités du module Employés.
        </p>
      </CardContent>
    </Card>
  );
};

export default PermissionsSettings;
