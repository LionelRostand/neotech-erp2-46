
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRentalSettings } from '../hooks/useRentalSettings';

const RentalGeneralTab: React.FC = () => {
  const { settings, updateSettings } = useRentalSettings();

  const handleInputChange = (field: string, value: string | number | boolean) => {
    updateSettings({ [field]: value });
  };

  return (
    <CardContent>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nom de l'entreprise</Label>
            <Input 
              value={settings.companyName} 
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Nom de votre entreprise de location"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Devise</Label>
            <Select 
              value={settings.currency}
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">€ Euro</SelectItem>
                <SelectItem value="USD">$ Dollar</SelectItem>
                <SelectItem value="CAD">$ Canadien</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Durée de location par défaut (jours)</Label>
            <Input 
              type="number"
              value={settings.defaultRentalDuration} 
              onChange={(e) => handleInputChange('defaultRentalDuration', Number(e.target.value))}
              placeholder="Durée standard de location"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Durée minimale de location (jours)</Label>
            <Input 
              type="number"
              value={settings.minRentalDuration} 
              onChange={(e) => handleInputChange('minRentalDuration', Number(e.target.value))}
              placeholder="Minimum de jours de location"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Durée maximale de location (jours)</Label>
            <Input 
              type="number"
              value={settings.maxRentalDuration} 
              onChange={(e) => handleInputChange('maxRentalDuration', Number(e.target.value))}
              placeholder="Maximum de jours de location"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={settings.allowWeekendRentals}
              onCheckedChange={(checked) => handleInputChange('allowWeekendRentals', checked)}
            />
            <Label>Autoriser les locations le week-end</Label>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button>Enregistrer les paramètres</Button>
      </div>
    </CardContent>
  );
};

export default RentalGeneralTab;
