
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de la bibliothèque</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="loans">Prêts</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Informations générales</h3>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez les paramètres généraux de la bibliothèque.
                </p>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nom de la bibliothèque</label>
                    <input 
                      type="text" 
                      className="border rounded p-2" 
                      defaultValue="Bibliothèque Municipale"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Adresse</label>
                    <textarea 
                      className="border rounded p-2" 
                      rows={3}
                      defaultValue="123 Rue des Livres, 75000 Paris" 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="loans" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Règles de prêt</h3>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez les durées et limites de prêt.
                </p>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Durée de prêt standard (jours)</label>
                    <input 
                      type="number" 
                      className="border rounded p-2" 
                      defaultValue={21} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nombre maximum de livres par adhérent</label>
                    <input 
                      type="number" 
                      className="border rounded p-2" 
                      defaultValue={5} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Frais de retard par jour (€)</label>
                    <input 
                      type="number" 
                      className="border rounded p-2" 
                      defaultValue={0.5} 
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Paramètres de notification</h3>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez les notifications automatiques envoyées aux adhérents.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="reminder-email" 
                      defaultChecked 
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor="reminder-email" className="text-sm font-medium">
                        Rappel par email
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Envoyer un rappel 3 jours avant la date de retour
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="overdue-notification" 
                      defaultChecked 
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor="overdue-notification" className="text-sm font-medium">
                        Notification de retard
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Envoyer une notification quand un prêt est en retard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="new-book-notification" 
                      defaultChecked={false} 
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor="new-book-notification" className="text-sm font-medium">
                        Nouveaux livres
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Notifier les adhérents quand de nouveaux livres sont ajoutés
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
