
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRentalSettings } from '@/hooks/vehicle-rentals/useRentalSettings';
import { Building2, Euro, Clock, MapPin, Bell } from "lucide-react";

const settingsFormSchema = z.object({
  companyName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  currency: z.string().min(1, 'Sélectionnez une devise'),
  defaultRentalDuration: z.number().min(1, 'La durée minimale est de 1 jour'),
  minRentalDuration: z.number().min(1, 'La durée minimale est de 1 jour'),
  maxRentalDuration: z.number().min(1, 'La durée minimale est de 1 jour'),
  allowWeekendRentals: z.boolean(),
  requireDeposit: z.boolean(),
  depositAmount: z.number().min(0, 'Le montant ne peut pas être négatif'),
  defaultPickupLocation: z.string(),
  notifications: z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
  }),
});

const RentalSettingsTab = () => {
  const { settings, isLoading, updateSettings } = useRentalSettings();

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings || {
      companyName: '',
      currency: 'EUR',
      defaultRentalDuration: 1,
      minRentalDuration: 1,
      maxRentalDuration: 30,
      allowWeekendRentals: true,
      requireDeposit: false,
      depositAmount: 0,
      defaultPickupLocation: '',
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
      },
    },
  });

  const onSubmit = (data: z.infer<typeof settingsFormSchema>) => {
    updateSettings(data);
  };

  if (isLoading) {
    return <div className="p-4">Chargement des paramètres...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations Générales
            </CardTitle>
            <CardDescription>
              Configurez les informations de base de votre service de location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une devise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar ($)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Durées de Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="defaultRentalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée par défaut (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minRentalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée minimum (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxRentalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée maximum (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allowWeekendRentals"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Autoriser les locations le week-end</FormLabel>
                    <FormDescription>
                      Permet aux clients de louer des véhicules pendant le week-end
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Caution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="requireDeposit"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Exiger une caution</FormLabel>
                    <FormDescription>
                      Demander une caution pour chaque location
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

            {form.watch('requireDeposit') && (
              <FormField
                control={form.control}
                name="depositAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de la caution</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notifications.emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Notifications par email</FormLabel>
                    <FormDescription>
                      Envoyer des notifications par email aux clients
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
              name="notifications.smsNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Notifications par SMS</FormLabel>
                    <FormDescription>
                      Envoyer des notifications par SMS aux clients
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
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RentalSettingsTab;
