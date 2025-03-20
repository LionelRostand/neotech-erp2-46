
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const SettingsPage: React.FC = () => {
  const settingsSchema = z.object({
    companyName: z.string().min(2, { message: 'Le nom de l\'établissement est requis' }),
    address: z.string().min(5, { message: 'L\'adresse est requise' }),
    phone: z.string().min(10, { message: 'Un numéro de téléphone valide est requis' }),
    email: z.string().email({ message: 'Email invalide' }),
    enableSmsNotifications: z.boolean().default(true),
    enableEmailNotifications: z.boolean().default(true),
    enablePatientPortal: z.boolean().default(false),
    archiveDuration: z.string().default('5'),
    autoBackup: z.boolean().default(true),
  });

  type SettingsValues = z.infer<typeof settingsSchema>;

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: 'Clinique Santé Plus',
      address: '23 rue de la Médecine, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'contact@clinique-santeplus.fr',
      enableSmsNotifications: true,
      enableEmailNotifications: true,
      enablePatientPortal: false,
      archiveDuration: '5',
      autoBackup: true,
    }
  });

  function onSubmit(data: SettingsValues) {
    console.log('Settings saved:', data);
    // Simulation de sauvegarde
    setTimeout(() => {
      alert('Paramètres enregistrés avec succès');
    }, 500);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres du Module Médical</h2>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="archive">Archivage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'établissement</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
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
                      control={form.control}
                      name="phone"
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
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor-auth">Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Renforce la sécurité pour l'accès au module médical
                  </p>
                </div>
                <Switch id="two-factor-auth" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="access-log">Journal d'accès</Label>
                  <p className="text-sm text-muted-foreground">
                    Enregistre toutes les actions effectuées sur les dossiers patients
                  </p>
                </div>
                <Switch id="access-log" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ip-restriction">Restriction d'IP</Label>
                  <p className="text-sm text-muted-foreground">
                    Limite l'accès au module aux adresses IP autorisées
                  </p>
                </div>
                <Switch id="ip-restriction" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableSmsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Notifications SMS</FormLabel>
                          <FormDescription>
                            Envoyer des rappels par SMS aux patients
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
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Notifications Email</FormLabel>
                          <FormDescription>
                            Envoyer des rappels par email aux patients
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
                    name="enablePatientPortal"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Portail Patient</FormLabel>
                          <FormDescription>
                            Activer l'accès au portail patient en ligne
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
                  
                  <div className="flex justify-end">
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'archivage</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="archiveDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée de conservation (années)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="1" max="50" />
                        </FormControl>
                        <FormDescription>
                          Durée légale de conservation des dossiers médicaux
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="autoBackup"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Sauvegarde automatique</FormLabel>
                          <FormDescription>
                            Effectuer des sauvegardes quotidiennes des dossiers
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
                  
                  <div className="flex justify-end">
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
