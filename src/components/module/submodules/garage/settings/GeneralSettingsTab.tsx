
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useGarageSettings } from '@/hooks/garage/useGarageSettings';

const GeneralSettingsTab = () => {
  const { settings, saveSettings } = useGarageSettings();
  const form = useForm({
    defaultValues: settings
  });

  const onSubmit = (data: any) => {
    saveSettings(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations du garage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du garage</Label>
              <Input 
                id="name" 
                {...form.register("name")}
                placeholder="Nom du garage" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">Numéro SIRET</Label>
              <Input 
                id="siret" 
                {...form.register("siret")}
                placeholder="XXX XXX XXX XXXXX" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Adresse</Label>
            <Input 
              id="street" 
              {...form.register("address.street")}
              placeholder="Numéro et nom de rue" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input 
                id="city" 
                {...form.register("address.city")}
                placeholder="Ville" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input 
                id="postalCode" 
                {...form.register("address.postalCode")}
                placeholder="Code postal" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input 
                id="country" 
                {...form.register("address.country")}
                defaultValue="France"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                {...form.register("phone")}
                type="tel" 
                placeholder="+33 X XX XX XX XX" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                {...form.register("email")}
                type="email" 
                placeholder="contact@garage.com" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
};

export default GeneralSettingsTab;
