
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Settings, RefreshCw, Globe, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FreightGeneralSettings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // State for form fields
  const [companyName, setCompanyName] = useState("NeoTech Freight");
  const [emailContact, setEmailContact] = useState("freight@neotech.com");
  const [phoneNumber, setPhoneNumber] = useState("01 23 45 67 89");
  const [defaultLanguage, setDefaultLanguage] = useState("fr");
  const [defaultCurrency, setDefaultCurrency] = useState("EUR");
  const [defaultUnit, setDefaultUnit] = useState("metric");
  const [enableTracking, setEnableTracking] = useState(true);
  const [autoSendNotifications, setAutoSendNotifications] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Paramètres enregistrés avec succès",
        description: "Les paramètres généraux ont été mis à jour."
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'enregistrement",
        description: "Une erreur s'est produite lors de l'enregistrement des paramètres.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <CardTitle>Paramètres généraux</CardTitle>
        </div>
        <CardDescription>
          Configurez les options générales du module de gestion de fret
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
            
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom de l'entreprise</Label>
              <Input 
                id="company-name" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-contact">Email de contact</Label>
              <Input 
                id="email-contact" 
                type="email"
                value={emailContact} 
                onChange={(e) => setEmailContact(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-number">Numéro de téléphone</Label>
              <Input 
                id="phone-number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres système</h3>
            
            <div className="space-y-2">
              <Label htmlFor="default-language">Langue par défaut</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger id="default-language">
                  <SelectValue placeholder="Choisir une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                  <SelectItem value="es">Espagnol</SelectItem>
                  <SelectItem value="de">Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-currency">Devise par défaut</Label>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger id="default-currency">
                  <SelectValue placeholder="Choisir une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dollar US ($)</SelectItem>
                  <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                  <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-unit">Système d'unités</Label>
              <Select value={defaultUnit} onValueChange={setDefaultUnit}>
                <SelectTrigger id="default-unit">
                  <SelectValue placeholder="Choisir un système" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Métrique (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Impérial (lb, in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-tracking">Suivi des expéditions</Label>
              <p className="text-sm text-muted-foreground">
                Activer le suivi GPS en temps réel des expéditions
              </p>
            </div>
            <Switch 
              id="enable-tracking"
              checked={enableTracking}
              onCheckedChange={setEnableTracking}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-notifications">Notifications automatiques</Label>
              <p className="text-sm text-muted-foreground">
                Envoyer des notifications automatiques aux clients lors des mises à jour d'expédition
              </p>
            </div>
            <Switch 
              id="auto-notifications"
              checked={autoSendNotifications}
              onCheckedChange={setAutoSendNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Approbation des expéditions</Label>
              <p className="text-sm text-muted-foreground">
                Exiger une approbation avant de finaliser les nouvelles expéditions
              </p>
            </div>
            <Switch 
              id="require-approval"
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightGeneralSettings;
