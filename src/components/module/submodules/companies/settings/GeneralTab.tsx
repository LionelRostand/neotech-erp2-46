
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save } from "lucide-react";

const GeneralTab: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Paramètres généraux</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input id="company-name" placeholder="Entrez le nom de l'entreprise" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="domain-name">Nom de domaine</Label>
            <Input id="domain-name" placeholder="exemple.com" />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="company-address">Adresse</Label>
          <Textarea id="company-address" placeholder="Entrez l'adresse complète" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="company-phone">Téléphone</Label>
            <Input id="company-phone" placeholder="+33 1 23 45 67 89" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="company-email">Email</Label>
            <Input id="company-email" placeholder="contact@exemple.com" type="email" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="company-website">Site web</Label>
            <Input id="company-website" placeholder="https://www.exemple.com" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Options avancées</h4>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Archivage automatique</p>
              <p className="text-sm text-muted-foreground">Archiver automatiquement les entreprises inactives</p>
            </div>
            <Switch id="archive-inactive" />
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Vérification d'adresse</p>
              <p className="text-sm text-muted-foreground">Vérifier les adresses lors de la création d'entreprise</p>
            </div>
            <Switch id="verify-address" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode confidentiel</p>
              <p className="text-sm text-muted-foreground">Masquer les données sensibles des entreprises</p>
            </div>
            <Switch id="confidential-mode" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GeneralTab;
