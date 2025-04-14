
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCrmSettings } from '../hooks/useCrmSettings';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { CompanySelect } from './components/CompanySelect';
import { LanguageAndCurrencySelect } from './components/LanguageAndCurrencySelect';
import { FeatureToggle } from './components/FeatureToggle';

const GeneralTab: React.FC = () => {
  const { settings, loading, error, saveSettings } = useCrmSettings();
  const { companies } = useHrModuleData();

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

  const handleCompanySelect = (value: string) => {
    const selectedCompany = companies?.find(company => company.id === value);
    if (selectedCompany) {
      saveSettings({ companyName: selectedCompany.name });
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="space-y-4">
            <CompanySelect 
              companies={companies}
              value={settings.companyName}
              onSelect={handleCompanySelect}
            />

            <LanguageAndCurrencySelect 
              defaultCurrency={settings.defaultCurrency}
              language={settings.language}
              onSelect={handleSelectChange}
            />

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

            <FeatureToggle 
              title="Notifications par email"
              description="Recevoir les notifications par email"
              checked={settings.emailNotifications}
              onChange={(checked) => handleSwitchChange("emailNotifications", checked)}
            />

            <FeatureToggle 
              title="Sauvegarde automatique"
              description="Effectuer des sauvegardes automatiques des données"
              checked={settings.automaticBackup}
              onChange={(checked) => handleSwitchChange("automaticBackup", checked)}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralTab;
