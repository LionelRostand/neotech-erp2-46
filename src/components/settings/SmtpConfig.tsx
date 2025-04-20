
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PlugZap, Send } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSmtpConfig } from '@/hooks/useSmtpConfig';
import { useSmtpTest } from '@/hooks/useSmtpTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SmtpConfig = () => {
  const { config, loading, saveConfig } = useSmtpConfig();
  const { isTesting, testSmtpConfig } = useSmtpTest();
  const [testEmail, setTestEmail] = useState('');
  const [formData, setFormData] = useState({
    outgoingServer: '',
    outgoingPort: '',
    outgoingUsername: '',
    outgoingPassword: '',
    useOutgoingSSL: false,
    incomingServer: '',
    incomingPort: '',
    incomingUsername: '',
    incomingPassword: '',
    incomingProtocol: 'imap' as 'imap' | 'pop3',
    useIncomingSSL: false
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

  const handleProtocolChange = (value: 'imap' | 'pop3') => {
    setFormData(prev => ({
      ...prev,
      incomingProtocol: value
    }));
  };

  const handleOutgoingSSLChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useOutgoingSSL: checked
    }));
  };

  const handleIncomingSSLChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useIncomingSSL: checked
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
        
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="outgoing">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="outgoing">Configuration Sortante (OUTGOING)</TabsTrigger>
                <TabsTrigger value="incoming">Configuration Entrante (INCOMING)</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="outgoing" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoingServer">Serveur SMTP</Label>
                      <Input 
                        id="smtp-outgoingServer" 
                        placeholder="smtp.example.com" 
                        value={formData.outgoingServer}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoingPort">Port</Label>
                      <Input 
                        id="smtp-outgoingPort" 
                        placeholder="587" 
                        type="text" 
                        value={formData.outgoingPort}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoingUsername">Nom d'utilisateur</Label>
                      <Input 
                        id="smtp-outgoingUsername" 
                        placeholder="username@example.com" 
                        value={formData.outgoingUsername}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-outgoingPassword">Mot de passe</Label>
                      <Input 
                        id="smtp-outgoingPassword" 
                        type="password" 
                        value={formData.outgoingPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={formData.useOutgoingSSL}
                      onCheckedChange={handleOutgoingSSLChange}
                    />
                    <Label>Utiliser SSL/TLS</Label>
                  </div>
                </TabsContent>

                <TabsContent value="incoming" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incomingProtocol">Protocole</Label>
                      <Select 
                        value={formData.incomingProtocol} 
                        onValueChange={handleProtocolChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un protocole" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imap">IMAP</SelectItem>
                          <SelectItem value="pop3">POP3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incomingServer">Serveur</Label>
                      <Input 
                        id="smtp-incomingServer" 
                        placeholder="imap.example.com" 
                        value={formData.incomingServer}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incomingPort">Port</Label>
                      <Input 
                        id="smtp-incomingPort" 
                        placeholder="993" 
                        type="text" 
                        value={formData.incomingPort}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incomingUsername">Nom d'utilisateur</Label>
                      <Input 
                        id="smtp-incomingUsername" 
                        placeholder="username@example.com" 
                        value={formData.incomingUsername}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-incomingPassword">Mot de passe</Label>
                      <Input 
                        id="smtp-incomingPassword" 
                        type="password" 
                        value={formData.incomingPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={formData.useIncomingSSL}
                      onCheckedChange={handleIncomingSSLChange}
                    />
                    <Label>Utiliser SSL/TLS</Label>
                  </div>
                </TabsContent>

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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SmtpConfig;
