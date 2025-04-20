
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationsTab = () => {
  const handleSave = () => {
    toast.success("Paramètres des notifications sauvegardés");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications par email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappels de rendez-vous</Label>
              <div className="text-sm text-muted-foreground">
                Envoyer des rappels aux clients avant leurs rendez-vous
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Statut des réparations</Label>
              <div className="text-sm text-muted-foreground">
                Informer les clients des mises à jour de leurs réparations
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications push</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nouvelles demandes</Label>
              <div className="text-sm text-muted-foreground">
                Recevoir une notification pour chaque nouvelle demande
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertes de stock</Label>
              <div className="text-sm text-muted-foreground">
                Notifications quand les pièces sont en stock faible
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="pt-2">
            <Label>Fréquence des notifications</Label>
            <Select defaultValue="immediate">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Sélectionner la fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immédiate</SelectItem>
                <SelectItem value="hourly">Toutes les heures</SelectItem>
                <SelectItem value="daily">Quotidienne</SelectItem>
              </SelectContent>
            </Select>
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

export default NotificationsTab;
