
import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const generalSettingsSchema = z.object({
  clinicName: z.string().min(2, { message: "Le nom de la clinique est obligatoire" }),
  address: z.object({
    street: z.string().min(2, { message: "La rue est obligatoire" }),
    city: z.string().min(2, { message: "La ville est obligatoire" }),
    postalCode: z.string().min(3, { message: "Le code postal est obligatoire" }),
    country: z.string().min(2, { message: "Le pays est obligatoire" }),
  }),
  contact: z.object({
    email: z.string().email({ message: "Email invalide" }),
    phone: z.string().min(5, { message: "Téléphone invalide" }),
    website: z.string().optional(),
  }),
  currency: z.string().min(1, { message: "La devise est obligatoire" }),
  language: z.string().min(1, { message: "La langue est obligatoire" }),
  taxRate: z.number().min(0).max(100)
});

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  appointmentReminders: z.boolean(),
  newPatientNotifications: z.boolean(),
  reportNotifications: z.boolean(),
  urgentAlertsOnly: z.boolean(),
});

const userPermissionsSchema = z.object({
  restrictSensitiveData: z.boolean(),
  restrictBillingAccess: z.boolean(),
  allowDataExport: z.boolean(),
  allowDataImport: z.boolean(),
});

const SettingsPage: React.FC = () => {
  const { settings, isLoading } = useHealthData();
  const { update } = useFirestore(COLLECTIONS.HEALTH.SETTINGS);
  const [activeTab, setActiveTab] = useState('general');

  // Default settings values if none are loaded
  const defaultSettings = {
    clinicName: "Clinique Médicale",
    address: {
      street: "12 Rue de la Santé",
      city: "Paris",
      postalCode: "75000",
      country: "France",
    },
    contact: {
      email: "contact@clinique.fr",
      phone: "01 23 45 67 89",
      website: "www.clinique.fr",
    },
    workingHours: {
      monday: "08:00 - 19:00",
      tuesday: "08:00 - 19:00",
      wednesday: "08:00 - 19:00",
      thursday: "08:00 - 19:00",
      friday: "08:00 - 19:00",
      saturday: "09:00 - 14:00",
      sunday: "Fermé",
    },
    currency: "EUR",
    language: "fr",
    taxRate: 20,
    emailNotifications: true,
    appointmentReminders: true,
    newPatientNotifications: true,
    reportNotifications: false,
    urgentAlertsOnly: false,
    restrictSensitiveData: true,
    restrictBillingAccess: true,
    allowDataExport: false,
    allowDataImport: false,
  };

  // Use loaded settings or default
  const currentSettings = settings?.[0] || defaultSettings;

  // Set up the form
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      clinicName: currentSettings.clinicName,
      address: currentSettings.address,
      contact: currentSettings.contact,
      currency: currentSettings.currency,
      language: currentSettings.language,
      taxRate: currentSettings.taxRate,
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: currentSettings.emailNotifications,
      appointmentReminders: currentSettings.appointmentReminders,
      newPatientNotifications: currentSettings.newPatientNotifications,
      reportNotifications: currentSettings.reportNotifications,
      urgentAlertsOnly: currentSettings.urgentAlertsOnly,
    },
  });

  const permissionsForm = useForm<z.infer<typeof userPermissionsSchema>>({
    resolver: zodResolver(userPermissionsSchema),
    defaultValues: {
      restrictSensitiveData: currentSettings.restrictSensitiveData,
      restrictBillingAccess: currentSettings.restrictBillingAccess,
      allowDataExport: currentSettings.allowDataExport,
      allowDataImport: currentSettings.allowDataImport,
    },
  });

  // Submit handlers
  const onGeneralSubmit = async (data: z.infer<typeof generalSettingsSchema>) => {
    try {
      if (settings?.[0]?.id) {
        await update(settings[0].id, {
          ...currentSettings,
          ...data,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Paramètres généraux enregistrés");
      } else {
        toast.error("Impossible de mettre à jour les paramètres");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    }
  };

  const onNotificationsSubmit = async (data: z.infer<typeof notificationsSchema>) => {
    try {
      if (settings?.[0]?.id) {
        await update(settings[0].id, {
          ...currentSettings,
          ...data,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Paramètres de notifications enregistrés");
      } else {
        toast.error("Impossible de mettre à jour les paramètres");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    }
  };

  const onPermissionsSubmit = async (data: z.infer<typeof userPermissionsSchema>) => {
    try {
      if (settings?.[0]?.id) {
        await update(settings[0].id, {
          ...currentSettings,
          ...data,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Paramètres de sécurité enregistrés");
      } else {
        toast.error("Impossible de mettre à jour les paramètres");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Paramètres
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Généraux</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="p-4 border rounded-md mt-2">
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
              <FormField
                control={generalForm.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la clinique</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={generalForm.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rue</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={generalForm.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="contact.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Web</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux de TVA (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="notifications" className="p-4 border rounded-md mt-2">
          <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={notificationsForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notifications par email</FormLabel>
                        <FormDescription>
                          Recevoir des notifications par email
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
                  control={notificationsForm.control}
                  name="appointmentReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Rappels de rendez-vous</FormLabel>
                        <FormDescription>
                          Envoyer des rappels pour les rendez-vous à venir
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
                  control={notificationsForm.control}
                  name="newPatientNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Nouveaux patients</FormLabel>
                        <FormDescription>
                          Recevoir des notifications pour les nouveaux patients
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
                  control={notificationsForm.control}
                  name="reportNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Rapports d'activité</FormLabel>
                        <FormDescription>
                          Recevoir des rapports d'activité hebdomadaires
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
                  control={notificationsForm.control}
                  name="urgentAlertsOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Alertes urgentes uniquement</FormLabel>
                        <FormDescription>
                          Ne recevoir que les alertes urgentes
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
              
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="security" className="p-4 border rounded-md mt-2">
          <Form {...permissionsForm}>
            <form onSubmit={permissionsForm.handleSubmit(onPermissionsSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={permissionsForm.control}
                  name="restrictSensitiveData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Restreindre les données sensibles</FormLabel>
                        <FormDescription>
                          Seuls les administrateurs peuvent accéder aux données sensibles
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
                  control={permissionsForm.control}
                  name="restrictBillingAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Restreindre l'accès à la facturation</FormLabel>
                        <FormDescription>
                          Seuls les administrateurs peuvent accéder aux données de facturation
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
                  control={permissionsForm.control}
                  name="allowDataExport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Autoriser l'export de données</FormLabel>
                        <FormDescription>
                          Les utilisateurs peuvent exporter des données
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
                  control={permissionsForm.control}
                  name="allowDataImport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Autoriser l'import de données</FormLabel>
                        <FormDescription>
                          Les utilisateurs peuvent importer des données
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
              
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
