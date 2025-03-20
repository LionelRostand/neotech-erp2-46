
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Save } from "lucide-react";

const CrmSyncTab: React.FC = () => {
  return (
    <>
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Synchronisation avec votre CRM</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">URL de l'API CRM</label>
              <Input placeholder="https://api.votrecrm.com/v1" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Clé API</label>
              <Input type="password" placeholder="Votre clé API secrète" />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Options de synchronisation</h4>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="sync-contacts" />
                <label htmlFor="sync-contacts" className="text-sm">Contacts</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sync-companies" />
                <label htmlFor="sync-companies" className="text-sm">Entreprises</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sync-deals" />
                <label htmlFor="sync-deals" className="text-sm">Opportunités</label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Fréquence de synchronisation</h4>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="sync-hourly" name="sync-frequency" />
                <label htmlFor="sync-hourly" className="text-sm">Toutes les heures</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="sync-daily" name="sync-frequency" defaultChecked />
                <label htmlFor="sync-daily" className="text-sm">Une fois par jour</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="sync-manual" name="sync-frequency" />
                <label htmlFor="sync-manual" className="text-sm">Manuellement</label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer la configuration
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tester la connexion
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>La synchronisation avec votre CRM vous permet de maintenir vos contacts et entreprises à jour dans les deux systèmes.</p>
        <p className="mt-2">Pour plus d'informations sur l'intégration, consultez la documentation.</p>
      </div>
    </>
  );
};

export default CrmSyncTab;
