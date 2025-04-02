
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface BookingSiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  termsConditions: string;
  privacyPolicy: string;
  allowGuestCheckout: boolean;
  requireEmailConfirmation: boolean;
  currency: string;
  language: string;
  timezone: string;
  bookingNotifications: boolean;
  remindersEnabled: boolean;
  cancelationPolicy: string;
  maxBookingDaysInAdvance: number;
  minHoursBeforeBooking: number;
}

const defaultSettings: BookingSiteSettings = {
  siteName: 'Service de Transport',
  siteDescription: 'Réservez votre trajet facilement et rapidement',
  contactEmail: 'contact@example.com',
  contactPhone: '+33 1 23 45 67 89',
  termsConditions: 'En réservant, vous acceptez nos conditions générales de service.',
  privacyPolicy: 'Nous respectons votre vie privée et protégeons vos données personnelles.',
  allowGuestCheckout: true,
  requireEmailConfirmation: true,
  currency: 'EUR',
  language: 'fr',
  timezone: 'Europe/Paris',
  bookingNotifications: true,
  remindersEnabled: true,
  cancelationPolicy: 'Annulation gratuite jusqu\'à 24h avant le départ',
  maxBookingDaysInAdvance: 90,
  minHoursBeforeBooking: 2
};

const SettingsForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<BookingSiteSettings>({
    defaultValues: defaultSettings
  });

  const onSubmit = (data: BookingSiteSettings) => {
    console.log('Saving settings:', data);
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres du site ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" collapsible className="w-full" defaultValue="general">
            <AccordionItem value="general">
              <AccordionTrigger className="text-lg font-medium">Paramètres généraux</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du site</FormLabel>
                        <FormControl>
                          <Input placeholder="Service de Transport" {...field} />
                        </FormControl>
                        <FormDescription>
                          Le nom principal qui apparaît sur votre site
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de contact</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email affiché sur le site et utilisé pour les notifications
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Réservez votre trajet facilement et rapidement" 
                            className="resize-none" 
                            rows={3} 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Une brève description de votre service
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de contact</FormLabel>
                        <FormControl>
                          <Input placeholder="+33 1 23 45 67 89" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Langue par défaut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une langue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="booking">
              <AccordionTrigger className="text-lg font-medium">Paramètres de réservation</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Devise</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuseau horaire</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un fuseau horaire" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                            <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="maxBookingDaysInAdvance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jours maximum à l'avance</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} max={365} />
                        </FormControl>
                        <FormDescription>
                          Nombre maximum de jours à l'avance pour une réservation
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minHoursBeforeBooking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heures minimum avant départ</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={0} max={72} />
                        </FormControl>
                        <FormDescription>
                          Délai minimum avant le départ (en heures)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="cancelationPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Politique d'annulation</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Annulation gratuite jusqu'à 24h avant le départ" 
                            className="resize-none" 
                            rows={2} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="allowGuestCheckout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Permettre la réservation sans compte</FormLabel>
                          <FormDescription>
                            Les clients peuvent réserver sans créer de compte
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
                    name="requireEmailConfirmation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Confirmation par email requise</FormLabel>
                          <FormDescription>
                            Exiger une confirmation par email avant validation
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notifications">
              <AccordionTrigger className="text-lg font-medium">Notifications</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bookingNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Notifications de réservation</FormLabel>
                          <FormDescription>
                            Envoyer des notifications pour les nouvelles réservations
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
                    name="remindersEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Rappels automatiques</FormLabel>
                          <FormDescription>
                            Envoyer des rappels avant le départ
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal">
              <AccordionTrigger className="text-lg font-medium">Mentions légales</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="termsConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditions générales</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Politique de confidentialité</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end">
            <Button type="submit" className="px-6">
              Enregistrer les paramètres
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
