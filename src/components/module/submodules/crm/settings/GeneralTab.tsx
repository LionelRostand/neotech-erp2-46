
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { useCrmSettings } from '../hooks/useCrmSettings';

const GeneralTab: React.FC = () => {
  const { settings, loading, saving, saveSettings } = useCrmSettings();
  
  const form = useForm({
    defaultValues: settings
  });

  // Mettre à jour le formulaire lorsque les paramètres sont chargés
  React.useEffect(() => {
    if (!loading) {
      form.reset(settings);
    }
  }, [loading, settings, form]);

  const onSubmit = async (data: any) => {
    try {
      await saveSettings(data);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-6">Paramètres généraux</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Ce nom apparaîtra sur tous les documents CRM.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise par défaut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar US ($)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                        <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Devise utilisée pour toutes les opportunités.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langue</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                        <SelectItem value="de">Allemand</SelectItem>
                        <SelectItem value="es">Espagnol</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Langue principale du module CRM.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataRetentionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Période de rétention des données (mois)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" max="60" />
                    </FormControl>
                    <FormDescription>
                      Durée de conservation des données clients inactifs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notifications par email</FormLabel>
                      <FormDescription>
                        Recevoir des notifications pour les nouveaux prospects et opportunités.
                      </FormDescription>
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
                name="automaticBackup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Sauvegarde automatique</FormLabel>
                      <FormDescription>
                        Sauvegarder automatiquement les données CRM chaque semaine.
                      </FormDescription>
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
            
            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conditions générales</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Saisissez vos conditions générales par défaut..."
                    />
                  </FormControl>
                  <FormDescription>
                    Ces conditions seront incluses par défaut dans les devis et contrats.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeneralTab;
