
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PlugZap, Send } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSmtpConfig } from '@/hooks/useSmtpConfig';
import { useSmtpTest } from '@/hooks/useSmtpTest';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const SmtpConfig = () => {
  const { config, loading, saveConfig } = useSmtpConfig();
  const { isTesting, testSmtpConfig } = useSmtpTest();
  const [testEmail, setTestEmail] = useState('');
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

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Veuillez saisir une adresse email de test");
      return;
    }

    try {
      const success = await testSmtpConfig({
        ...formData,
        testEmail
      });

      if (success) {
        toast.success("Email de test envoyé avec succès");
      }
    } catch (error) {
      console.error('Error testing SMTP:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Configuration SMTP</h1>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-server">Serveur SMTP</Label>
                <Input 
                  id="smtp-server" 
                  placeholder="smtp.example.com" 
                  value={formData.server}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input 
                  id="smtp-port" 
                  placeholder="587" 
                  type="text" 
                  value={formData.port}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-username">Nom d'utilisateur</Label>
                <Input 
                  id="smtp-username" 
                  placeholder="username@example.com" 
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">Mot de passe</Label>
                <Input 
                  id="smtp-password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={formData.useSSL}
                onCheckedChange={handleSwitchChange}
              />
              <Label>Utiliser SSL/TLS</Label>
            </div>

            <div className="border-t pt-4 mt-4">
              <Label htmlFor="test-email" className="mb-2 block">Email de test</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="test-email"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendTestEmail}
                  disabled={isTesting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isTesting ? "Envoi..." : "Envoyer un email de test"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit">
                <PlugZap className="h-4 w-4 mr-2" />
                Enregistrer la configuration
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SmtpConfig;
