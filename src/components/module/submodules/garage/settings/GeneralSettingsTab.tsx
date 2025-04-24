
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGarageSettings } from '@/hooks/garage/useGarageSettings';

const GeneralSettingsTab = () => {
  const { settings, loading, saveSettings } = useGarageSettings();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    saveSettings({
      name: formData.get('name') as string,
      address: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
      },
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      siret: formData.get('siret') as string,
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du garage</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du garage
              </label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={settings.name} 
                placeholder="Nom du garage" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="siret" className="text-sm font-medium">
                Numéro SIRET
              </label>
              <Input 
                id="siret" 
                name="siret" 
                defaultValue={settings.siret} 
                placeholder="XXX XXX XXX XXXXX" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="street" className="text-sm font-medium">
              Adresse
            </label>
            <Input 
              id="street" 
              name="street" 
              defaultValue={settings.address.street} 
              placeholder="Numéro et nom de rue" 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                Ville
              </label>
              <Input 
                id="city" 
                name="city" 
                defaultValue={settings.address.city} 
                placeholder="Ville" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-sm font-medium">
                Code postal
              </label>
              <Input 
                id="postalCode" 
                name="postalCode" 
                defaultValue={settings.address.postalCode} 
                placeholder="Code postal" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Pays
              </label>
              <Input 
                id="country" 
                name="country" 
                defaultValue={settings.address.country} 
                placeholder="Pays" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Téléphone
              </label>
              <Input 
                id="phone" 
                name="phone" 
                defaultValue={settings.phone} 
                placeholder="+33 X XX XX XX XX" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                name="email" 
                defaultValue={settings.email} 
                placeholder="contact@garage.com" 
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;
