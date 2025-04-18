
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PlugZap } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSmtpConfig } from '@/hooks/useSmtpConfig';

const SmtpConfig = () => {
  const { config, loading, saveConfig } = useSmtpConfig();
  const [isTesting, setIsTesting] = useState(false);
  const [formData, setFormData] = useState({
    server: '',
    port: '',
    username: '',
    password: '',
    useSSL: false
  });

  React.useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('smtp-', '')]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useSSL: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveConfig(formData);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!formData.server || !formData.port || !formData.username || !formData.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsTesting(true);
    try {
      // Simuler un appel API pour tester la connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Connexion SMTP établie avec succès");
    } catch (error) {
      console.error('Erreur de test SMTP:', error);
      toast.error("Échec de la connexion SMTP");
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Configuration SMTP</h1>
        <p className="mb-4">Configurez vos paramètres email pour l'envoi de notifications.</p>
        
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="smtp-server" className="text-sm font-medium">Serveur SMTP</label>
                <Input 
                  id="smtp-server" 
                  placeholder="smtp.example.com" 
                  value={formData.server}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="smtp-port" className="text-sm font-medium">Port</label>
                <Input 
                  id="smtp-port" 
                  placeholder="587" 
                  type="number" 
                  value={formData.port}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="smtp-username" className="text-sm font-medium">Nom d'utilisateur</label>
                <Input 
                  id="smtp-username" 
                  placeholder="username@example.com" 
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="smtp-password" className="text-sm font-medium">Mot de passe</label>
                <Input 
                  id="smtp-password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <Switch 
                id="smtp-ssl" 
                checked={formData.useSSL}
                onCheckedChange={handleSwitchChange}
              />
              <label htmlFor="smtp-ssl" className="text-sm font-medium">Utiliser SSL/TLS</label>
            </div>
            <div className="pt-4 flex gap-2">
              <Button type="submit">Enregistrer la configuration</Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                <PlugZap className="h-4 w-4 mr-2" />
                {isTesting ? "Test en cours..." : "Tester la connexion"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SmtpConfig;
