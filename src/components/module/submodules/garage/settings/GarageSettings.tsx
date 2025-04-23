
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield } from 'lucide-react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import GaragePermissionsTab from './GaragePermissionsTab';
import { usePermissions } from '@/hooks/usePermissions';

const GarageSettings = () => {
  const { settings, isLoading } = useGarageData();
  const [activeTab, setActiveTab] = useState('general');
  const { isAdmin } = usePermissions();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  if (!settings) {
    return <div className="flex items-center justify-center h-96">Aucun paramètre trouvé</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-3xl font-bold">Paramètres du Garage</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Droits d'accès
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Email: {settings.notifications?.email ? 'Activé' : 'Désactivé'}</p>
                  <p>Push: {settings.notifications?.push ? 'Activé' : 'Désactivé'}</p>
                  <p>Fréquence: {settings.notifications?.frequency}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horaires d'Ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {settings.workingHours && Object.entries(settings.workingHours).map(([day, hours]) => (
                    <p key={day} className="flex justify-between">
                      <span className="capitalize">{day}</span>
                      <span>{hours.start} - {hours.end}</span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres par Défaut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Notifications automatiques: {settings.defaultSettings?.autoNotifications ? 'Activé' : 'Désactivé'}</p>
                  <p>Confirmation requise: {settings.defaultSettings?.requireConfirmation ? 'Activé' : 'Désactivé'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <GaragePermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GarageSettings;
