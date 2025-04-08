
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Phone } from 'lucide-react';

interface NotificationSettingsProps {
  packageId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ packageId }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [statuses, setStatuses] = useState({
    in_transit: true,
    delayed: true,
    out_for_delivery: true,
    delivered: true,
    exception: true
  });
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les entrées
    if (emailEnabled && !email) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }
    
    if (smsEnabled && !phone) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez entrer un numéro de téléphone valide.",
        variant: "destructive"
      });
      return;
    }
    
    // Dans une application réelle, nous enregistrerions les préférences dans la base de données
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de notification ont été enregistrées.",
    });
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Préférences de notification
          </CardTitle>
          <CardDescription>
            Configurez comment vous souhaitez être notifié des mises à jour de votre colis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Activer les notifications
            </label>
          </div>
          
          {notificationsEnabled && (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Méthodes de notification</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      checked={emailEnabled}
                      onCheckedChange={(checked) => setEmailEnabled(checked === true)}
                    />
                    <label htmlFor="email-notifications" className="text-sm font-medium leading-none flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </label>
                  </div>
                  
                  {emailEnabled && (
                    <div className="ml-6 mt-2">
                      <Input
                        type="email"
                        placeholder="Votre adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-notifications"
                      checked={smsEnabled}
                      onCheckedChange={(checked) => setSmsEnabled(checked === true)}
                    />
                    <label htmlFor="sms-notifications" className="text-sm font-medium leading-none flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      SMS
                    </label>
                  </div>
                  
                  {smsEnabled && (
                    <div className="ml-6 mt-2">
                      <Input
                        type="tel"
                        placeholder="Votre numéro de téléphone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Événements à notifier</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-in-transit"
                      checked={statuses.in_transit}
                      onCheckedChange={(checked) => setStatuses(s => ({ ...s, in_transit: checked === true }))}
                    />
                    <label htmlFor="status-in-transit" className="text-sm leading-none">En transit</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-delayed"
                      checked={statuses.delayed}
                      onCheckedChange={(checked) => setStatuses(s => ({ ...s, delayed: checked === true }))}
                    />
                    <label htmlFor="status-delayed" className="text-sm leading-none">Retardé</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-out-for-delivery"
                      checked={statuses.out_for_delivery}
                      onCheckedChange={(checked) => setStatuses(s => ({ ...s, out_for_delivery: checked === true }))}
                    />
                    <label htmlFor="status-out-for-delivery" className="text-sm leading-none">En cours de livraison</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-delivered"
                      checked={statuses.delivered}
                      onCheckedChange={(checked) => setStatuses(s => ({ ...s, delivered: checked === true }))}
                    />
                    <label htmlFor="status-delivered" className="text-sm leading-none">Livré</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-exception"
                      checked={statuses.exception}
                      onCheckedChange={(checked) => setStatuses(s => ({ ...s, exception: checked === true }))}
                    />
                    <label htmlFor="status-exception" className="text-sm leading-none">Problème</label>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!notificationsEnabled}>Enregistrer les préférences</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NotificationSettings;
