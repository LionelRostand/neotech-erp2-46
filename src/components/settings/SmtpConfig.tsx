
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

const SmtpConfig = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration SMTP</h1>
      <p className="mb-4">Configurez vos paramètres email pour l'envoi de notifications.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="smtp-server">Serveur SMTP</label>
              <Input id="smtp-server" placeholder="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="smtp-port">Port</label>
              <Input id="smtp-port" placeholder="587" type="number" />
            </div>
            <div className="space-y-2">
              <label htmlFor="smtp-username">Nom d'utilisateur</label>
              <Input id="smtp-username" placeholder="username@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="smtp-password">Mot de passe</label>
              <Input id="smtp-password" type="password" />
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <Switch id="smtp-ssl" />
            <label htmlFor="smtp-ssl">Utiliser SSL/TLS</label>
          </div>
          <div className="pt-4">
            <Button>Enregistrer la configuration</Button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
);

export default SmtpConfig;
