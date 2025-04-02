
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Globe, Bell, Scale, FileText, Cog, Clock } from 'lucide-react';

const SettingsForm: React.FC = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres du site de réservation ont été mis à jour.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Réservation</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Mentions légales</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nom du site</Label>
              <Input id="site-name" placeholder="Site de réservation" defaultValue="Transport Express" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">URL du site</Label>
              <div className="flex gap-2">
                <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground">
                  https://
                </div>
                <Input id="site-url" className="rounded-l-none flex-1" defaultValue="transport-express.reservations.com" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Description</Label>
            <Textarea 
              id="site-description" 
              placeholder="Description de votre site de réservation"
              defaultValue="Réservez votre transport facilement et en quelques clics. Service rapide et professionnel."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email de contact</Label>
              <Input id="contact-email" type="email" placeholder="contact@exemple.com" defaultValue="contact@transport-express.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Téléphone de contact</Label>
              <Input id="contact-phone" placeholder="+33 1 23 45 67 89" defaultValue="+33 1 23 45 67 89" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Select defaultValue="europe-paris">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Sélectionner un fuseau horaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                <SelectItem value="america-new_york">America/New_York (UTC-5)</SelectItem>
                <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Langue par défaut</Label>
            <Select defaultValue="fr">
              <SelectTrigger id="language">
                <SelectValue placeholder="Sélectionner une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <div className="space-y-2">
            <Label>Périodes de réservation</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="advance-booking">Réservation à l'avance (jours)</Label>
                <Select defaultValue="60">
                  <SelectTrigger id="advance-booking">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="14">14 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="60">60 jours</SelectItem>
                    <SelectItem value="90">90 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum-notice">Préavis minimum (heures)</Label>
                <Select defaultValue="24">
                  <SelectTrigger id="minimum-notice">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 heure</SelectItem>
                    <SelectItem value="2">2 heures</SelectItem>
                    <SelectItem value="3">3 heures</SelectItem>
                    <SelectItem value="6">6 heures</SelectItem>
                    <SelectItem value="12">12 heures</SelectItem>
                    <SelectItem value="24">24 heures</SelectItem>
                    <SelectItem value="48">48 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Capacités et disponibilités</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max-bookings-per-day">Maximum de réservations par jour</Label>
                <Input id="max-bookings-per-day" type="number" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-vehicles">Nombre de véhicules disponibles</Label>
                <Input id="max-vehicles" type="number" defaultValue="10" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Options de réservation</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Confirmation automatique</p>
                <p className="text-xs text-muted-foreground">Les réservations sont confirmées automatiquement</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Annulation en ligne</p>
                <p className="text-xs text-muted-foreground">Les clients peuvent annuler leur réservation en ligne</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Modification de réservation</p>
                <p className="text-xs text-muted-foreground">Les clients peuvent modifier leurs réservations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Paiement en ligne</p>
                <p className="text-xs text-muted-foreground">Activer les paiements en ligne</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center">
                  <Cog className="h-4 w-4 mr-2" />
                  Options avancées
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Géolocalisation</p>
                      <p className="text-xs text-muted-foreground">Activer la géolocalisation pour les adresses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Prix dynamique</p>
                      <p className="text-xs text-muted-foreground">Ajuster les prix en fonction de la demande</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">File d'attente</p>
                      <p className="text-xs text-muted-foreground">Permettre aux clients de rejoindre une liste d'attente</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buffer-time">Temps tampon entre réservations (minutes)</Label>
                    <Input id="buffer-time" type="number" defaultValue="15" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-3">
            <Label>Notifications par email</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email de confirmation</p>
                <p className="text-xs text-muted-foreground">Envoyer un email lors de la confirmation d'une réservation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Rappel de réservation</p>
                <p className="text-xs text-muted-foreground">Envoyer un rappel avant la réservation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notification d'annulation</p>
                <p className="text-xs text-muted-foreground">Envoyer un email lors de l'annulation d'une réservation</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Notifications SMS</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS de confirmation</p>
                <p className="text-xs text-muted-foreground">Envoyer un SMS lors de la confirmation d'une réservation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Rappel par SMS</p>
                <p className="text-xs text-muted-foreground">Envoyer un rappel SMS avant la réservation</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time">Rappel avant réservation</Label>
            <Select defaultValue="24">
              <SelectTrigger id="reminder-time">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 heure avant</SelectItem>
                <SelectItem value="2">2 heures avant</SelectItem>
                <SelectItem value="3">3 heures avant</SelectItem>
                <SelectItem value="12">12 heures avant</SelectItem>
                <SelectItem value="24">24 heures avant</SelectItem>
                <SelectItem value="48">48 heures avant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-sender">Email de l'expéditeur</Label>
            <Input id="email-sender" type="email" defaultValue="reservations@transport-express.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-template">Modèle d'email de confirmation</Label>
            <Textarea 
              id="email-template" 
              className="min-h-[150px]"
              defaultValue="Cher(e) {client_name},\n\nVotre réservation a été confirmée.\n\nDate: {booking_date}\nHeure: {booking_time}\nAdresse de départ: {pickup_address}\nDestination: {destination_address}\n\nMerci de votre confiance,\nL'équipe Transport Express"
            />
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="terms-conditions">Conditions générales d'utilisation</Label>
            <Textarea 
              id="terms-conditions" 
              className="min-h-[200px]"
              defaultValue="Les présentes conditions générales définissent les modalités d'utilisation du service de réservation en ligne proposé par Transport Express.\n\n1. Réservation\n2. Annulation\n3. Paiement\n4. Protection des données personnelles"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy-policy">Politique de confidentialité</Label>
            <Textarea 
              id="privacy-policy" 
              className="min-h-[200px]"
              defaultValue="Transport Express s'engage à protéger vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre service de réservation en ligne."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cookie-policy">Politique de cookies</Label>
            <Textarea 
              id="cookie-policy" 
              className="min-h-[150px]"
              defaultValue="Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre ordinateur qui nous aident à fournir une meilleure expérience utilisateur."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Bannière de cookies</p>
                <p className="text-xs text-muted-foreground">Afficher une bannière de consentement pour les cookies</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Mentions légales obligatoires</p>
                <p className="text-xs text-muted-foreground">Afficher les mentions légales obligatoires dans le pied de page</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-info">Informations légales de l'entreprise</Label>
            <Textarea 
              id="company-info" 
              className="min-h-[150px]"
              defaultValue="Transport Express\nSARL au capital de 50 000€\nRCS Paris B 123 456 789\nSiège social : 123 Avenue de la République, 75011 Paris\nN° TVA : FR 12 345 678 901"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Annuler</Button>
        <Button onClick={handleSaveSettings}>Enregistrer les paramètres</Button>
      </div>
    </div>
  );
};

export default SettingsForm;
