
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, GitMerge, ArchiveRestore, Building2, Users, CreditCard } from "lucide-react";

const CrmSyncTab: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <GitMerge className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Synchronisation CRM</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Label htmlFor="enable-crm-sync" className="text-base font-medium">Activer la synchronisation</Label>
            </div>
            <p className="text-sm text-muted-foreground">Synchroniser automatiquement les données avec le CRM</p>
          </div>
          <Switch id="enable-crm-sync" defaultChecked />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sync-frequency">Fréquence de synchronisation</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="sync-frequency">
                <SelectValue placeholder="Sélectionner une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Toutes les heures</SelectItem>
                <SelectItem value="daily">Quotidienne</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="manual">Manuelle uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sync-time">Heure de synchronisation</Label>
            <Select defaultValue="night">
              <SelectTrigger id="sync-time">
                <SelectValue placeholder="Sélectionner une heure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Matin (8h)</SelectItem>
                <SelectItem value="noon">Midi (12h)</SelectItem>
                <SelectItem value="evening">Soir (18h)</SelectItem>
                <SelectItem value="night">Nuit (2h)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Données à synchroniser</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                <span>Entreprises</span>
              </div>
              <Switch id="sync-companies" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span>Contacts</span>
              </div>
              <Switch id="sync-contacts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                <span>Opportunités</span>
              </div>
              <Switch id="sync-deals" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            <ArchiveRestore className="h-4 w-4 inline mr-1" />
            Dernière synchronisation: <span className="font-medium">25/03/2025 à 14:32</span>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser maintenant
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CrmSyncTab;
