
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save } from "lucide-react";

const SettingsTab: React.FC = () => {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="sms">SMS</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
            <CardDescription>
              Configurez les paramètres généraux du service client
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom de l'entreprise</Label>
              <Input id="company-name" defaultValue="NeoTech Transport" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="support-email">Email du support</Label>
              <Input id="support-email" defaultValue="support@neotech-transport.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="support-phone">Téléphone du support</Label>
              <Input id="support-phone" defaultValue="01 23 45 67 89" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-reply">Réponse automatique</Label>
                <Switch id="auto-reply" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Envoyer une réponse automatique lorsqu'un client vous contacte en dehors des heures d'ouverture
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-hours">Heures d'ouverture</Label>
              <Input id="business-hours" defaultValue="Lun-Ven : 9h-18h, Sam : 10h-15h" />
            </div>
            
            <div className="pt-4">
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Modèles d'emails</CardTitle>
            <CardDescription>
              Configurez les modèles d'emails automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcome-template">Email de bienvenue</Label>
              <Textarea 
                id="welcome-template" 
                rows={5}
                defaultValue="Bonjour {client_name},\n\nMerci d'avoir choisi NeoTech Transport. Nous sommes ravis de vous compter parmi nos clients.\n\nN'hésitez pas à nous contacter si vous avez des questions.\n\nL'équipe NeoTech Transport"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="booking-confirmation">Confirmation de réservation</Label>
              <Textarea 
                id="booking-confirmation" 
                rows={5}
                defaultValue="Bonjour {client_name},\n\nVotre réservation #{booking_number} a été confirmée pour le {booking_date}.\n\nDétails de la réservation :\n- Véhicule : {vehicle_type}\n- Chauffeur : {driver_name}\n- Heure d'arrivée : {pickup_time}\n\nL'équipe NeoTech Transport"
              />
            </div>
            
            <div className="pt-4">
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sms" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuration SMS</CardTitle>
            <CardDescription>
              Paramétrez les messages SMS automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-enabled">Service SMS actif</Label>
                <Switch id="sms-enabled" defaultChecked />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sms-provider">Fournisseur SMS</Label>
              <Input id="sms-provider" defaultValue="Twilio" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="booking-sms">SMS de confirmation</Label>
              <Textarea 
                id="booking-sms" 
                rows={3}
                defaultValue="NeoTech Transport: Votre chauffeur arrivera à {pickup_time}. Pour toute question, appelez le {support_phone}."
              />
            </div>
            
            <div className="pt-4">
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configurez les préférences de notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouveaux messages</p>
                  <p className="text-sm text-muted-foreground">Recevoir une notification pour les nouveaux messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appels manqués</p>
                  <p className="text-sm text-muted-foreground">Recevoir une notification pour les appels manqués</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Réponses aux emails</p>
                  <p className="text-sm text-muted-foreground">Recevoir une notification pour les réponses aux emails</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Réclamations</p>
                  <p className="text-sm text-muted-foreground">Recevoir une notification pour les nouvelles réclamations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTab;
