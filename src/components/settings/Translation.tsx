
import React from 'react';
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";

const Translation = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Traduction de la plateforme</h1>
      <p className="mb-4">Configurez les langues disponibles et gérez les traductions.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Langues disponibles</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch id="lang-fr" checked={true} />
            <label htmlFor="lang-fr">Français (par défaut)</label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch id="lang-en" />
            <label htmlFor="lang-en">Anglais</label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch id="lang-es" />
            <label htmlFor="lang-es">Espagnol</label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch id="lang-de" />
            <label htmlFor="lang-de">Allemand</label>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Translation;
