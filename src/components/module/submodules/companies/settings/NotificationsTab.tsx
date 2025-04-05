
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BellRing, Save, Users, Building, FileText, MailCheck } from "lucide-react";

const NotificationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <BellRing className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Préférences de notification</h3>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-blue-500" />
                <h4 className="text-base font-medium">Entreprises</h4>
              </div>
              <p className="text-sm text-muted-foreground">Notifications concernant les modifications d'entreprises</p>
            </div>
            <Switch id="company-notifications" defaultChecked />
          </div>

          <div className="ml-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Nouvelle entreprise créée</span>
              <Switch id="new-company-notification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Entreprise modifiée</span>
              <Switch id="company-updated-notification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Entreprise supprimée</span>
              <Switch id="company-deleted-notification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Changement de statut</span>
              <Switch id="company-status-notification" defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-t py-4">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <h4 className="text-base font-medium">Contacts</h4>
              </div>
              <p className="text-sm text-muted-foreground">Notifications concernant les contacts d'entreprises</p>
            </div>
            <Switch id="contact-notifications" defaultChecked />
          </div>

          <div className="ml-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Nouveau contact ajouté</span>
              <Switch id="new-contact-notification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Contact modifié</span>
              <Switch id="contact-updated-notification" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Contact supprimé</span>
              <Switch id="contact-deleted-notification" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-t py-4">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                <h4 className="text-base font-medium">Documents</h4>
              </div>
              <p className="text-sm text-muted-foreground">Notifications concernant les documents d'entreprises</p>
            </div>
            <Switch id="document-notifications" />
          </div>

          <div className="ml-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Nouveau document ajouté</span>
              <Switch id="new-document-notification" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Document modifié</span>
              <Switch id="document-updated-notification" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Document supprimé</span>
              <Switch id="document-deleted-notification" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
              <MailCheck className="h-4 w-4 text-blue-500" />
              <h4 className="text-base font-medium">Méthode de notification</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm">Email</span>
                <Select defaultValue="immediate">
                  <SelectTrigger>
                    <SelectValue placeholder="Fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiat</SelectItem>
                    <SelectItem value="daily">Résumé quotidien</SelectItem>
                    <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
                    <SelectItem value="disabled">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm">Notification interne</span>
                <Select defaultValue="immediate">
                  <SelectTrigger>
                    <SelectValue placeholder="Fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiat</SelectItem>
                    <SelectItem value="daily">Résumé quotidien</SelectItem>
                    <SelectItem value="disabled">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les préférences
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationsTab;
