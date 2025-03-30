
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings, RefreshCw, Globe, Clock, Workflow, Mail } from "lucide-react";
import { toast } from "sonner";

const TransportGeneralTab: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState("NeoTech Transport");
  const [emailContact, setEmailContact] = useState("contact@neotech-transport.com");
  const [phoneNumber, setPhoneNumber] = useState("01 23 45 67 89");
  const [defaultLanguage, setDefaultLanguage] = useState("fr");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [workingHours, setWorkingHours] = useState("Lun-Ven: 9h-18h, Sam: 9h-13h");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoAssignDrivers, setAutoAssignDrivers] = useState(false);
  const [defaultVehicleType, setDefaultVehicleType] = useState("sedan");

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Paramètres enregistrés avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des paramètres");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Paramètres généraux</span>
        </CardTitle>
        <CardDescription>
          Configurez les paramètres généraux du module Transport
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
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
            
            <div className="space-y-2">
              <Label htmlFor="working-hours">Horaires d'ouverture</Label>
              <Input 
                id="working-hours" 
                value={workingHours} 
                onChange={(e) => setWorkingHours(e.target.value)} 
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
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Choisir un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                  <SelectItem value="Europe/London">Europe/Londres (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">Amérique/New York (UTC-5)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asie/Tokyo (UTC+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-vehicle">Type de véhicule par défaut</Label>
              <Select value={defaultVehicleType} onValueChange={setDefaultVehicleType}>
                <SelectTrigger id="default-vehicle">
                  <SelectValue placeholder="Choisir un type de véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Berline</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="luxury">Véhicule de luxe</SelectItem>
                  <SelectItem value="minibus">Minibus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications automatiques</Label>
              <p className="text-sm text-muted-foreground">
                Envoyer des notifications aux clients et chauffeurs
              </p>
            </div>
            <Switch 
              id="notifications"
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-assign">Attribution automatique des chauffeurs</Label>
              <p className="text-sm text-muted-foreground">
                Assigner automatiquement les chauffeurs disponibles aux réservations
              </p>
            </div>
            <Switch 
              id="auto-assign"
              checked={autoAssignDrivers}
              onCheckedChange={setAutoAssignDrivers}
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

export default TransportGeneralTab;
