
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const GeneralSettingsTab = () => {
  const handleSave = () => {
    toast.success("Paramètres sauvegardés avec succès");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations du garage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="garageName">Nom du garage</Label>
              <Input id="garageName" placeholder="Nom du garage" defaultValue="Auto Garage Pro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">Numéro SIRET</Label>
              <Input id="siret" placeholder="XXX XXX XXX XXXXX" defaultValue="123 456 789 00001" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="+33 X XX XX XX XX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contact@garage.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" placeholder="Adresse complète" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horaires d'ouverture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => (
              <div key={day} className="flex items-center justify-between p-2 border rounded">
                <span>{day}</span>
                <div className="flex items-center gap-2">
                  <Input 
                    type="time" 
                    className="w-32" 
                    defaultValue="09:00"
                  />
                  <span>-</span>
                  <Input 
                    type="time" 
                    className="w-32" 
                    defaultValue="18:00"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres par défaut</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications automatiques</Label>
              <div className="text-sm text-muted-foreground">
                Envoyer des notifications aux clients pour les rappels de rendez-vous
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Confirmation de rendez-vous</Label>
              <div className="text-sm text-muted-foreground">
                Demander une confirmation pour les nouveaux rendez-vous
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;
