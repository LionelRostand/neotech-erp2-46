
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/DashboardLayout";

const TwoFactorSettings = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Authentification à deux facteurs (2FA)</h1>
      <p className="mb-4">Gérez les paramètres de sécurité pour l'authentification à deux facteurs.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">État du 2FA</h2>
            <p className="text-gray-500">Activez ou désactivez l'authentification à deux facteurs pour tous les utilisateurs</p>
          </div>
          <Switch id="2fa-status" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Options disponibles</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="2fa-app" checked={true} />
            <label htmlFor="2fa-app">Application d'authentification (Google Authenticator, Authy)</label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="2fa-sms" />
            <label htmlFor="2fa-sms">SMS</label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="2fa-email" />
            <label htmlFor="2fa-email">Email</label>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default TwoFactorSettings;
