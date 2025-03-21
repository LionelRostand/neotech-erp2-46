
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, MessageSquare, Calendar } from "lucide-react";

interface ClientNotificationsProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

const ClientNotifications: React.FC<ClientNotificationsProps> = ({
  clientId,
  clientName,
  clientEmail,
  clientPhone
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [notificationSettings, setNotificationSettings] = useState({
    smsEnabled: true,
    emailEnabled: true,
    appointmentReminders: true,
    birthdayMessages: true,
    promotions: false
  });

  const handleToggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleSendMessage = (type: 'sms' | 'email') => {
    if (!message.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez saisir un message avant d'envoyer",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API to send the message
    toast({
      title: `${type === 'sms' ? 'SMS' : 'Email'} envoyé`,
      description: `Message envoyé à ${clientName}`
    });
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-xl">
            <Bell className="mr-2 h-5 w-5" />
            Notifications et rappels
          </CardTitle>
          <CardDescription>
            Gérez les notifications et les rappels pour ce client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base">Notifications par SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      {clientPhone || "Aucun numéro de téléphone"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.smsEnabled}
                  onCheckedChange={() => handleToggleSetting('smsEnabled')}
                  disabled={!clientPhone}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      {clientEmail || "Aucune adresse email"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.emailEnabled}
                  onCheckedChange={() => handleToggleSetting('emailEnabled')}
                  disabled={!clientEmail}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base">Rappels de rendez-vous</Label>
                    <p className="text-sm text-muted-foreground">
                      24h avant le rendez-vous
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.appointmentReminders}
                  onCheckedChange={() => handleToggleSetting('appointmentReminders')}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <Label className="mb-2 block">Envoyer un message maintenant</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Saisissez votre message ici..."
                rows={3}
              />
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSendMessage('sms')}
                  disabled={!clientPhone || !notificationSettings.smsEnabled}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Envoyer par SMS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSendMessage('email')}
                  disabled={!clientEmail || !notificationSettings.emailEnabled}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer par email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotifications;
