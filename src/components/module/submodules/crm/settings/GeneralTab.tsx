
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCrmSettings } from '../hooks/useCrmSettings';

const GeneralTab: React.FC = () => {
  const { settings, loading, saving, error, saveSettings } = useCrmSettings();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    saveSettings({ [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    saveSettings({ [name]: checked });
  };

  const handleSelectChange = (name: string, value: string) => {
    saveSettings({ [name]: value });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Chargement des paramètres...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            <p>Une erreur est survenue lors du chargement des paramètres.</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                value={settings.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                <Select 
                  value={settings.defaultCurrency}
                  onValueChange={(value) => handleSelectChange("defaultCurrency", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre sterling (£)</SelectItem>
                    <SelectItem value="CAD">Dollar canadien ($)</SelectItem>
                    <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={settings.language}
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                    <SelectItem value="es">Espagnol</SelectItem>
                    <SelectItem value="de">Allemand</SelectItem>
                    <SelectItem value="it">Italien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="termsAndConditions">Conditions générales</Label>
              <Textarea 
                id="termsAndConditions" 
                name="termsAndConditions"
                value={settings.termsAndConditions} 
                onChange={handleInputChange}
                rows={5}
                placeholder="Conditions générales à inclure dans les documents commerciaux..."
              />
            </div>

            <div>
              <Label htmlFor="dataRetentionPeriod">Période de conservation des données (mois)</Label>
              <Select 
                value={settings.dataRetentionPeriod}
                onValueChange={(value) => handleSelectChange("dataRetentionPeriod", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 mois</SelectItem>
                  <SelectItem value="12">12 mois</SelectItem>
                  <SelectItem value="24">24 mois</SelectItem>
                  <SelectItem value="36">36 mois</SelectItem>
                  <SelectItem value="60">60 mois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Notifications par email</h3>
                <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Sauvegarde automatique</h3>
                <p className="text-sm text-gray-500">Effectuer des sauvegardes automatiques des données</p>
              </div>
              <Switch 
                checked={settings.automaticBackup}
                onCheckedChange={(checked) => handleSwitchChange("automaticBackup", checked)}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralTab;
