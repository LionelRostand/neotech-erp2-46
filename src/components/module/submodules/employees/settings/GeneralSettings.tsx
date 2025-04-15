
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Save, Loader2 } from "lucide-react";
import { useGeneralSettings } from "./hooks/useGeneralSettings";

const GeneralSettings: React.FC = () => {
  const { form, isSaving, onSubmit } = useGeneralSettings();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration générale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Paramètres de visualisation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Affichage</h3>
              
              <FormField
                control={form.control}
                name="showProfilePhotos"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Afficher les photos de profil</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Afficher les photos de profil des employés dans les listes
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
                name="compactMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Mode compact</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Réduire l'espacement entre les éléments
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

            {/* Paramètres par défaut */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Valeurs par défaut</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="defaultDepartment"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Département par défaut</FormLabel>
                      <FormControl>
                        <Input placeholder="Sélectionnez un département" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultRole"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Rôle par défaut</FormLabel>
                      <FormControl>
                        <Input placeholder="Sélectionnez un rôle" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Options d'exportation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options d'exportation</h3>
              <FormField
                control={form.control}
                name="includeConfidentialData"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Inclure les données confidentielles</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Inclure les informations sensibles dans les exports
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

export default GeneralSettings;
