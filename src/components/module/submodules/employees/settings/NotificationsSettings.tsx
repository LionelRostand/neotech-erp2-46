
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useNotificationsSettings } from "./hooks/useNotificationsSettings";

const NotificationsSettings: React.FC = () => {
  const { form, isSaving, onSubmit } = useNotificationsSettings();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Notifications par email</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Recevoir les notifications par email
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newEmployeeAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Alertes nouveaux employés</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notifications lors de l'ajout de nouveaux employés
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaveRequestAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Alertes demandes de congés</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les demandes de congés
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Mises à jour des documents</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notifications lors des modifications de documents
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weeklyDigest"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Résumé hebdomadaire</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Recevoir un résumé hebdomadaire des activités
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerApprovals"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Approbations managers</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les approbations des managers
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer les modifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default NotificationsSettings;
