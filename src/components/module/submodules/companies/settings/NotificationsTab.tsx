
import React from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BellRing, Save } from "lucide-react";

const NotificationsTab: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <BellRing className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Paramètres de notifications</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Notifications par email</h4>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Nouvelle entreprise</p>
              <p className="text-sm text-muted-foreground">Recevoir une notification lors de la création d'une nouvelle entreprise</p>
            </div>
            <Switch id="notify-new-company" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Modification d'entreprise</p>
              <p className="text-sm text-muted-foreground">Recevoir une notification lors de la modification d'une entreprise</p>
            </div>
            <Switch id="notify-edit-company" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nouveau contact</p>
              <p className="text-sm text-muted-foreground">Recevoir une notification lors de l'ajout d'un nouveau contact</p>
            </div>
            <Switch id="notify-new-contact" defaultChecked />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="font-medium">Notifications dans l'application</h4>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Activité des entreprises</p>
              <p className="text-sm text-muted-foreground">Afficher les notifications d'activité des entreprises</p>
            </div>
            <Switch id="inapp-company-activity" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Rappels d'échéances</p>
              <p className="text-sm text-muted-foreground">Recevoir des rappels pour les échéances importantes</p>
            </div>
            <Switch id="inapp-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertes système</p>
              <p className="text-sm text-muted-foreground">Recevoir les alertes système concernant les entreprises</p>
            </div>
            <Switch id="inapp-system-alerts" defaultChecked />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <h4 className="font-medium">Fréquence des notifications par email</h4>
          <Select defaultValue="daily">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immédiatement</SelectItem>
              <SelectItem value="hourly">Toutes les heures</SelectItem>
              <SelectItem value="daily">Résumé quotidien</SelectItem>
              <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end pt-4">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les préférences
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationsTab;
