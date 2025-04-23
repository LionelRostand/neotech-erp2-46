import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield } from 'lucide-react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import GaragePermissionsTab from './GaragePermissionsTab';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';

const GarageSettings = () => {
  const { settings, isLoading } = useGarageData();
  const [activeTab, setActiveTab] = useState('general');
  const { isAdmin } = usePermissions();

  const DefaultSettings = {
    notifications: {
      email: false,
      push: false,
      frequency: "quotidien"
    },
    workingHours: {
      lundi: { start: "08:00", end: "18:00" },
      mardi: { start: "08:00", end: "18:00" },
      mercredi: { start: "08:00", end: "18:00" },
      jeudi: { start: "08:00", end: "18:00" },
      vendredi: { start: "08:00", end: "18:00" },
      samedi: { start: "09:00", end: "13:00" },
      dimanche: { start: "Fermé", end: "Fermé" }
    },
    defaultSettings: {
      autoNotifications: false,
      requireConfirmation: true
    }
  };

  const settingsData = settings || DefaultSettings;

  // Si toujours en chargement, afficher un loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
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
          {isAdmin && (
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Droits d'accès
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Email: {settingsData.notifications?.email ? 'Activé' : 'Désactivé'}</p>
                  <p>Push: {settingsData.notifications?.push ? 'Activé' : 'Désactivé'}</p>
                  <p>Fréquence: {settingsData.notifications?.frequency}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horaires d'Ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {settingsData.workingHours && Object.entries(settingsData.workingHours).map(([day, hours]) => (
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
                  <p>Notifications automatiques: {settingsData.defaultSettings?.autoNotifications ? 'Activé' : 'Désactivé'}</p>
                  <p>Confirmation requise: {settingsData.defaultSettings?.requireConfirmation ? 'Activé' : 'Désactivé'}</p>
                </div>
                <div className="mt-4">
                  <Button>Modifier les paramètres</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="permissions">
            <GaragePermissionsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default GarageSettings;
