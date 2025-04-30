
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageAndCurrencySelectProps {
  defaultCurrency: string;
  language: string;
  onSelect: (name: string, value: string) => void;
}

export const LanguageAndCurrencySelect: React.FC<LanguageAndCurrencySelectProps> = ({
  defaultCurrency,
  language,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="defaultCurrency">Devise par défaut</Label>
        <Select 
          value={defaultCurrency}
          onValueChange={(value) => onSelect("defaultCurrency", value)}
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
          value={language}
          onValueChange={(value) => onSelect("language", value)}
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
  );
};
