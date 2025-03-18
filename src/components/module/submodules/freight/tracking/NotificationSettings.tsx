
import React, { useState } from 'react';
import { PackageStatus } from '@/types/freight';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { formatPackageStatus } from './mockTrackingData';
import { Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  packageId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ packageId }) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    statuses: {
      registered: false,
      processing: true,
      in_transit: true,
      out_for_delivery: true,
      delivered: true,
      delayed: true,
      exception: true,
      returned: true,
      lost: true,
    },
  });
  
  const handleStatusToggle = (status: string) => {
    setPreferences(prev => ({
      ...prev,
      statuses: {
        ...prev.statuses,
        [status]: !prev.statuses[status as keyof typeof prev.statuses],
      }
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would call an API to save preferences
    toast({
      title: "Paramètres enregistrés",
      description: "Vos préférences de notification ont été mises à jour.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Badge className="h-5 w-5 mr-2" />
          Paramètres de notification
        </CardTitle>
        <CardDescription>
          Configurez comment et quand vous souhaitez être notifié des changements de statut
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Méthodes de notification</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Email</div>
              <div className="text-sm text-gray-500">Notifications par email</div>
            </div>
            <Switch 
              checked={preferences.email}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">SMS</div>
              <div className="text-sm text-gray-500">Notifications par SMS</div>
            </div>
            <Switch 
              checked={preferences.sms}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, sms: checked }))}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Événements à notifier</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(preferences.statuses).map((status) => (
              <div key={status} className="flex items-center justify-between">
                <div className="font-medium">{formatPackageStatus(status)}</div>
                <Switch 
                  checked={preferences.statuses[status as keyof typeof preferences.statuses]}
                  onCheckedChange={() => handleStatusToggle(status)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Enregistrer les préférences</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
