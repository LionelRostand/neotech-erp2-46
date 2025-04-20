
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SmtpConfig = () => {
  const { config, loading, saveConfig } = useSmtpConfig();
  const { isTesting, testSmtpConfig } = useSmtpTest();
  const [testEmail, setTestEmail] = useState('');
  const [formData, setFormData] = useState({
    outgoing: {
      server: '',
      port: '',
      username: '',
      password: '',
      useSSL: false
    },
    incoming: {
      server: '',
      port: '',
      username: '',
      password: '',
      useSSL: false,
      protocol: 'imap' as const
    }
  });

  React.useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'outgoing' | 'incoming') => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [id.replace(`smtp-${section}-`, '')]: value
      }
    }));
  };

  const handleSwitchChange = (checked: boolean, section: 'outgoing' | 'incoming') => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        useSSL: checked
      }
    }));
  };

  const handleProtocolChange = (value: 'imap' | 'pop3') => {
    setFormData(prev => ({
      ...prev,
      incoming: {
        ...prev.incoming,
        protocol: value
      }
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
        ...formData.outgoing,
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
          <Tabs defaultValue="outgoing">
            <TabsList className="mb-6">
              <TabsTrigger value="outgoing">Configuration Sortante (OUTGOING)</TabsTrigger>
              <TabsTrigger value="incoming">Configuration Entrante (INCOMING)</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="outgoing">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoing-server">Serveur SMTP</Label>
                      <Input 
                        id="smtp-outgoing-server" 
                        placeholder="smtp.example.com" 
                        value={formData.outgoing.server}
                        onChange={(e) => handleInputChange(e, 'outgoing')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoing-port">Port</Label>
                      <Input 
                        id="smtp-outgoing-port" 
                        placeholder="587" 
                        type="text" 
                        value={formData.outgoing.port}
                        onChange={(e) => handleInputChange(e, 'outgoing')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoing-username">Nom d'utilisateur</Label>
                      <Input 
                        id="smtp-outgoing-username" 
                        placeholder="username@example.com" 
                        value={formData.outgoing.username}
                        onChange={(e) => handleInputChange(e, 'outgoing')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoing-password">Mot de passe</Label>
                      <Input 
                        id="smtp-outgoing-password" 
                        type="password" 
                        value={formData.outgoing.password}
                        onChange={(e) => handleInputChange(e, 'outgoing')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={formData.outgoing.useSSL}
                      onCheckedChange={(checked) => handleSwitchChange(checked, 'outgoing')}
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
                </div>
              </TabsContent>

              <TabsContent value="incoming">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-incoming-server">Serveur de réception</Label>
                      <Input 
                        id="smtp-incoming-server" 
                        placeholder="imap.example.com" 
                        value={formData.incoming.server}
                        onChange={(e) => handleInputChange(e, 'incoming')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incoming-port">Port</Label>
                      <Input 
                        id="smtp-incoming-port" 
                        placeholder="993" 
                        type="text" 
                        value={formData.incoming.port}
                        onChange={(e) => handleInputChange(e, 'incoming')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incoming-username">Nom d'utilisateur</Label>
                      <Input 
                        id="smtp-incoming-username" 
                        placeholder="username@example.com" 
                        value={formData.incoming.username}
                        onChange={(e) => handleInputChange(e, 'incoming')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incoming-password">Mot de passe</Label>
                      <Input 
                        id="smtp-incoming-password" 
                        type="password" 
                        value={formData.incoming.password}
                        onChange={(e) => handleInputChange(e, 'incoming')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Protocole</Label>
                    <Select 
                      value={formData.incoming.protocol}
                      onValueChange={handleProtocolChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un protocole" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imap">IMAP</SelectItem>
                        <SelectItem value="pop3">POP3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={formData.incoming.useSSL}
                      onCheckedChange={(checked) => handleSwitchChange(checked, 'incoming')}
                    />
                    <Label>Utiliser SSL/TLS</Label>
                  </div>
                </div>
              </TabsContent>

              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
                <Button type="submit">
                  <PlugZap className="h-4 w-4 mr-2" />
                  Enregistrer la configuration
                </Button>
              </div>
            </form>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SmtpConfig;
